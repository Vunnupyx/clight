import { StateMachine } from '..';
import { StateAndTransitions } from '../interfaces';

jest.mock('winston');

const stateAndTransitions: StateAndTransitions = {
  INIT: {
    transition: () => 'START_UPDATE',
    transitions: {
      START_UPDATE: 'GET_UPDATES'
    }
  },
  GET_UPDATES: {
    transition: () => {},
    transitions: {
      UPDATE_FOUND: 'CHECK_INSTALLED_COS_VERSION',
      NO_UPDATE_FOUND: 'END'
    }
  },
  CHECK_INSTALLED_COS_VERSION: {
    transition: () => {},
    transitions: {
      VERSION_OK: 'APPLY_MODULE_UPDATES',
      VERSION_NOT_OK: 'CHECK_COS_UPDATES'
    }
  },
  CHECK_COS_UPDATES: {
    transition: () => {},
    transitions: {
      UPDATE_AVAILABLE: 'APPLY_COS_UPDATES',
      UPDATE_NOT_AVAILABLE: 'START_DOWNLOAD_COS_UPDATES'
    }
  },
  START_DOWNLOAD_COS_UPDATES: {
    transition: () => {},
    transitions: {
      COS_DOWNLOAD_STARTED: 'VALIDATE_COS_DOWNLOAD'
    }
  },
  VALIDATE_COS_DOWNLOAD: {
    transition: () => {},
    transitions: {
      COS_DOWNLOADED: 'APPLY_COS_UPDATES'
    }
  },
  APPLY_COS_UPDATES: {
    transition: () => {},
    transitions: {
      INSTALLING_COS: 'WAITING_FOR_SYSTEM_RESTART'
    }
  },
  WAITING_FOR_SYSTEM_RESTART: {
    transition: () => {},
    transitions: {
      SYSTEM_RESTARTED: 'APPLY_MODULE_UPDATES'
    }
  },
  APPLY_MODULE_UPDATES: {
    transition: () => {},
    transitions: {
      MODULE_UPDATE_APPLIED: 'WAIT_FOR_MODULE_UPDATE'
    }
  },
  WAIT_FOR_MODULE_UPDATE: {
    transition: () => {},
    transitions: {
      SUCCESS: 'END'
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

  test('Unexpected transition response will throw', async () => {
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
    expect(stateMachine.emit).not.toHaveBeenCalledWith(
      'stateChanged',
      'GET_UPDATES'
    );
    expect(stateMachine.emit).toHaveBeenCalledWith('stateChanged', 'END');
    expect(stateMachine.currentState).toBe('END');
  });

  test('No update found ends the state machine', async () => {
    const stateMachine = new StateMachine(
      {
        ...stateAndTransitions,
        GET_UPDATES: {
          ...stateAndTransitions.GET_UPDATES,
          transition: () => 'NO_UPDATE_FOUND'
        }
      },
      initialState
    );
    jest.spyOn(stateMachine, 'emit');

    expect(stateMachine.currentState).toBe(undefined);
    await stateMachine.start();
    expect(stateMachine.emit).toHaveBeenCalledWith(
      'stateChanged',
      'GET_UPDATES'
    );
    expect(stateMachine.emit).toHaveBeenCalledWith('stateChanged', 'END');
    expect(stateMachine.currentState).toBe('END');
  });

  test('Update found and checks installed version', async () => {
    const stateMachine = new StateMachine(
      {
        ...stateAndTransitions,
        GET_UPDATES: {
          ...stateAndTransitions.GET_UPDATES,
          transition: () => 'UPDATE_FOUND'
        }
      },
      initialState
    );
    jest.spyOn(stateMachine, 'emit');

    expect(stateMachine.currentState).toBe(undefined);
    await stateMachine.start();
    expect(stateMachine.emit).toHaveBeenCalledWith(
      'stateChanged',
      'GET_UPDATES'
    );
    expect(stateMachine.emit).toHaveBeenCalledWith(
      'stateChanged',
      'CHECK_INSTALLED_COS_VERSION'
    );
    expect(stateMachine.currentState).toBe('END');
  });

  test('Update found and installed version is not ok', async () => {
    const stateMachine = new StateMachine(
      {
        ...stateAndTransitions,
        GET_UPDATES: {
          ...stateAndTransitions.GET_UPDATES,
          transition: () => 'UPDATE_FOUND'
        },
        CHECK_INSTALLED_COS_VERSION: {
          ...stateAndTransitions.CHECK_INSTALLED_COS_VERSION,
          transition: () => 'VERSION_NOT_OK'
        },
        CHECK_COS_UPDATES: {
          ...stateAndTransitions.CHECK_COS_UPDATES,
          transition: () => 'UPDATE_NOT_AVAILABLE'
        },
        START_DOWNLOAD_COS_UPDATES: {
          ...stateAndTransitions.START_DOWNLOAD_COS_UPDATES,
          transition: () => 'COS_DOWNLOAD_STARTED'
        },
        VALIDATE_COS_DOWNLOAD: {
          ...stateAndTransitions.VALIDATE_COS_DOWNLOAD,
          transition: () => 'COS_DOWNLOADED'
        },
        APPLY_COS_UPDATES: {
          ...stateAndTransitions.APPLY_COS_UPDATES,
          transition: () => 'INSTALLING_COS'
        },
        WAITING_FOR_SYSTEM_RESTART: {
          ...stateAndTransitions.WAITING_FOR_SYSTEM_RESTART,
          transition: () => 'SYSTEM_RESTARTED'
        },
        APPLY_MODULE_UPDATES: {
          ...stateAndTransitions.APPLY_MODULE_UPDATES,
          transition: () => 'MODULE_UPDATE_APPLIED'
        },
        WAIT_FOR_MODULE_UPDATE: {
          ...stateAndTransitions.WAIT_FOR_MODULE_UPDATE,
          transition: () => 'SUCCESS'
        }
      },
      initialState
    );
    jest.spyOn(stateMachine, 'emit');

    expect(stateMachine.currentState).toBe(undefined);
    await stateMachine.start();
    expect(stateMachine.emit).toHaveBeenCalledWith(
      'stateChanged',
      'GET_UPDATES'
    );
    expect(stateMachine.emit).toHaveBeenCalledWith(
      'stateChanged',
      'CHECK_INSTALLED_COS_VERSION'
    );
    expect(stateMachine.emit).toHaveBeenCalledWith(
      'stateChanged',
      'CHECK_COS_UPDATES'
    );
    expect(stateMachine.emit).toHaveBeenCalledWith(
      'stateChanged',
      'START_DOWNLOAD_COS_UPDATES'
    );
    expect(stateMachine.emit).toHaveBeenCalledWith(
      'stateChanged',
      'VALIDATE_COS_DOWNLOAD'
    );
    expect(stateMachine.emit).toHaveBeenCalledWith(
      'stateChanged',
      'APPLY_COS_UPDATES'
    );
    expect(stateMachine.emit).toHaveBeenCalledWith(
      'stateChanged',
      'WAITING_FOR_SYSTEM_RESTART'
    );
    expect(stateMachine.emit).toHaveBeenCalledWith(
      'stateChanged',
      'APPLY_MODULE_UPDATES'
    );
    expect(stateMachine.emit).toHaveBeenCalledWith(
      'stateChanged',
      'WAIT_FOR_MODULE_UPDATE'
    );
    expect(stateMachine.currentState).toBe('END');
  });
});
