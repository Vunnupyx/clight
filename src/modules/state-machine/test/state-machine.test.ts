import { StateMachine } from '..';
import { StateAndTransitions } from '../interfaces';

jest.mock('winston');

const stateAndTransitions: StateAndTransitions = {
  INIT: {
    transition: () => 'START',
    transitions: {
      START: 'STATE1',
      GOTOSTATE3: 'STATE3'
    }
  },
  STATE1: {
    transition: () => {},
    transitions: {
      TRANSITION1: 'STATE2',
      TRANSITION2: 'END'
    }
  },
  STATE2: {
    transition: () => {},
    transitions: {
      RESULT_OK: 'END',
      RESULT_NOK: 'STATE1'
    }
  },
  STATE3: {
    transition: () => 'TRANSIT',
    transitions: {
      TRANSIT: 'DEAD_END'
    }
  }
};

const initialState = 'INIT';

describe('State Machine', () => {
  test('Wrong initial state ends the state machine', async () => {
    const stateMachine = new StateMachine(stateAndTransitions, 'WRONG');
    jest.spyOn(stateMachine, 'emit');

    expect(stateMachine.currentState).toBe(undefined);
    await stateMachine.start();
    expect(stateMachine.currentState).toBe('END');
  });

  test('No response from transition ends the state machine', async () => {
    const stateMachine = new StateMachine(
      {
        ...stateAndTransitions,
        STATE1: {
          ...stateAndTransitions.STATE1,
          transition: () => {}
        }
      },
      initialState
    );
    jest.spyOn(stateMachine, 'emit');

    expect(stateMachine.currentState).toBe(undefined);
    await stateMachine.start();
    expect(stateMachine.emit).toHaveBeenCalledWith('STATE1');
    expect(stateMachine.emit).not.toHaveBeenCalledWith('STATE2');
    expect(stateMachine.emit).not.toHaveBeenCalledWith('STATE3');
    expect(stateMachine.emit).toHaveBeenCalledWith('END');
    expect(stateMachine.currentState).toBe('END');
  });

  test('Wrong transition response will end the state machine', async () => {
    const stateMachine = new StateMachine(
      {
        ...stateAndTransitions,
        INIT: {
          ...stateAndTransitions.INIT,
          transition: () => 'WRONG'
        }
      },
      initialState
    );
    jest.spyOn(stateMachine, 'emit');

    expect(stateMachine.currentState).toBe(undefined);
    await stateMachine.start();
    expect(stateMachine.emit).not.toHaveBeenCalledWith('GET_UPDATES');
    expect(stateMachine.emit).toHaveBeenCalledWith('END');
    expect(stateMachine.currentState).toBe('END');
  });

  test('Ends the state machine if a transition leads to a not existing state', async () => {
    const stateMachine = new StateMachine(
      {
        ...stateAndTransitions,
        INIT: {
          ...stateAndTransitions.INIT,
          transition: () => 'GOTOSTATE3'
        }
      },
      initialState
    );
    jest.spyOn(stateMachine, 'emit');

    expect(stateMachine.currentState).toBe(undefined);
    await stateMachine.start();
    expect(stateMachine.emit).toHaveBeenCalledWith('STATE3');
    expect(stateMachine.emit).toHaveBeenCalledWith('END');
    expect(stateMachine.currentState).toBe('END');
  });

  test('Successful happy path', async () => {
    const stateMachine = new StateMachine(
      {
        ...stateAndTransitions,
        STATE1: {
          ...stateAndTransitions.STATE1,
          transition: () => 'TRANSITION1'
        },
        STATE2: {
          ...stateAndTransitions.STATE2,
          transition: () => 'RESULT_OK'
        }
      },
      initialState
    );
    jest.spyOn(stateMachine, 'emit');

    expect(stateMachine.currentState).toBe(undefined);
    await stateMachine.start();
    expect(stateMachine.emit).toHaveBeenCalledWith('STATE1');
    expect(stateMachine.emit).toHaveBeenCalledWith('STATE2');
    expect(stateMachine.emit).toHaveBeenCalledWith('END');
    expect(stateMachine.currentState).toBe('END');
  });

  test('Second state sends back to first state and it ends', async () => {
    let counter = 0;
    const stateMachine = new StateMachine(
      {
        ...stateAndTransitions,
        STATE1: {
          ...stateAndTransitions.STATE1,
          transition: () => {
            if (counter === 0) {
              counter++;
              return 'TRANSITION1';
            } else {
              return 'TRANSITION2';
            }
          }
        },
        STATE2: {
          ...stateAndTransitions.STATE2,
          transition: () => 'RESULT_NOK'
        }
      },
      initialState
    );
    jest.spyOn(stateMachine, 'emit');

    expect(stateMachine.currentState).toBe(undefined);
    await stateMachine.start();
    expect(stateMachine.emit).toHaveBeenCalledWith('STATE1');
    expect(stateMachine.emit).toHaveBeenCalledWith('STATE2');
    expect(stateMachine.emit).toHaveBeenCalledWith('STATE1');
    expect(stateMachine.emit).toHaveBeenCalledWith('END');
    expect(stateMachine.currentState).toBe('END');
  });
});
