import { StateMachine, StateAndTransitions } from '..';

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
    transition: () => 'NOEND',
    transitions: {
      NOEND: 'DEAD_END'
    }
  }
};

describe('State Machine', () => {
  const onStateChange = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Handles failure cases', () => {
    test('Wrong initial state ends the state machine', async () => {
      const stateMachine = new StateMachine(
        stateAndTransitions,
        onStateChange,
        'WRONG'
      );

      await stateMachine.start();
      expect(onStateChange).toHaveBeenCalledWith(
        'END',
        'ERROR_WRONG_TRANSITION'
      );
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
        onStateChange
      );

      await stateMachine.start();
      expect(onStateChange).toHaveBeenCalledWith('STATE1', undefined);
      expect(onStateChange).not.toHaveBeenCalledWith('STATE2', undefined);
      expect(onStateChange).not.toHaveBeenCalledWith('STATE3', undefined);
      expect(onStateChange).toHaveBeenCalledWith('END', undefined);
    });

    test('Wrong transition response will end the state machine with that as reason', async () => {
      const stateMachine = new StateMachine(
        {
          ...stateAndTransitions,
          INIT: {
            ...stateAndTransitions.INIT,
            transition: () => 'FAILED'
          }
        },
        onStateChange
      );

      await stateMachine.start();
      expect(onStateChange).not.toHaveBeenCalledWith('GET_UPDATES');
      expect(onStateChange).toHaveBeenCalledWith('END', 'FAILED');
    });

    test('Failed long transition ends the state machine', async () => {
      jest.useFakeTimers();
      const stateMachine = new StateMachine(
        {
          ...stateAndTransitions,
          STATE1: {
            ...stateAndTransitions.STATE1,
            transition: () =>
              new Promise((resolve, reject) => {
                setTimeout(() => reject(), 20 * 1000);
                jest.runAllTimers();
              })
          }
        },
        onStateChange
      );

      await stateMachine.start();
      expect(onStateChange).toHaveBeenCalledWith('STATE1', undefined);
      expect(onStateChange).toHaveBeenCalledWith('END', 'ERROR');

      jest.useRealTimers();
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
        onStateChange
      );

      await stateMachine.start();
      expect(onStateChange).toHaveBeenCalledWith('STATE3', undefined);
      expect(onStateChange).toHaveBeenCalledWith(
        'END',
        'ERROR_WRONG_TRANSITION'
      );
    });
  });
  describe('Handles success cases', () => {
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
        onStateChange
      );

      await stateMachine.start();
      expect(onStateChange).toHaveBeenCalledWith('STATE1', undefined);
      expect(onStateChange).toHaveBeenCalledWith('STATE2', undefined);
      expect(onStateChange).toHaveBeenCalledWith('END', 'RESULT_OK');
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
        onStateChange
      );

      await stateMachine.start();
      expect(onStateChange).toHaveBeenCalledWith('STATE1', undefined);
      expect(onStateChange).toHaveBeenCalledWith('STATE2', undefined);
      expect(onStateChange).toHaveBeenCalledWith('STATE1', undefined);
      expect(onStateChange).toHaveBeenCalledWith('END', 'TRANSITION2');
    });

    test('Long processing before transition is settled', async () => {
      jest.useFakeTimers();
      const stateMachine = new StateMachine(
        {
          ...stateAndTransitions,
          STATE1: {
            ...stateAndTransitions.STATE1,
            transition: () =>
              new Promise((resolve) => {
                setTimeout(() => resolve('TRANSITION2'), 20 * 1000);
                jest.runAllTimers();
              })
          }
        },
        onStateChange
      );

      await stateMachine.start();
      expect(onStateChange).toHaveBeenCalledWith('STATE1', undefined);
      expect(onStateChange).toHaveBeenCalledWith('END', 'TRANSITION2');
      jest.useRealTimers();
    });

    test('Starting at a different state', async () => {
      jest.useFakeTimers();
      const stateMachine = new StateMachine(
        {
          ...stateAndTransitions,
          STATE2: {
            ...stateAndTransitions.STATE2,
            transition: () =>
              new Promise((resolve) => {
                setTimeout(() => resolve('RESULT_OK'), 20 * 1000);
                jest.runAllTimers();
              })
          }
        },
        onStateChange,
        'STATE2'
      );

      await stateMachine.start();
      expect(onStateChange).toHaveBeenCalledWith('END', 'RESULT_OK');

      jest.useRealTimers();
    });
  });
});
