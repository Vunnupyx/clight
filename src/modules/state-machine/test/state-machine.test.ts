import { StateMachine } from '..';
import { StateAndTransitions } from '../interfaces';

jest.mock('winston');

const stateAndTransitions: StateAndTransitions = {
  INIT: {
    action: () => 'START_UPDATE',
    transitions: {
      START_UPDATE: 'GET_UPDATES'
    }
  },
  GET_UPDATES: {
    action: () => {},
    transitions: {
      UPDATE_FOUND: 'CHECK_INSTALLED_COS_VERSION',
      NO_UPDATE_FOUND: 'END'
    }
  },
  CHECK_INSTALLED_COS_VERSION: {
    action: () => {},
    transitions: {
      VERSION_OK: 'APPLY_MODULE_UPDATES',
      VERSION_NOT_OK: 'CHECK_COS_UPDATES'
    }
  },
  CHECK_COS_UPDATES: {
    action: () => {},
    transitions: {
      UPDATE_AVAILABLE: 'APPLY_COS_UPDATES',
      UPDATE_NOT_AVAILABLE: 'START_DOWNLOAD_COS_UPDATES'
    }
  },
  START_DOWNLOAD_COS_UPDATES: {
    action: () => {},
    transitions: {
      COS_DOWNLOAD_STARTED: 'VALIDATE_COS_DOWNLOAD'
    }
  },
  VALIDATE_COS_DOWNLOAD: {
    action: () => {},
    transitions: {
      COS_DOWNLOADED: 'APPLY_COS_UPDATES'
    }
  },
  APPLY_COS_UPDATES: {
    action: () => {},
    transitions: {
      INSTALLING_COS: 'WAITING_FOR_SYSTEM_RESTART'
    }
  },
  WAITING_FOR_SYSTEM_RESTART: {
    action: () => {},
    transitions: {
      SYSTEM_RESTARTED: 'APPLY_MODULE_UPDATES'
    }
  },
  APPLY_MODULE_UPDATES: {
    action: () => {},
    transitions: {
      MODULE_UPDATE_APPLIED: 'WAIT_FOR_MODULE_UPDATE'
    }
  },
  WAIT_FOR_MODULE_UPDATE: {
    action: () => {},
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

  test('Unexpected response will throw', async () => {
    const stateMachine = new StateMachine(
      {
        ...stateAndTransitions,
        INIT: {
          action: () => 'WRONG',
          transitions: {
            START_UPDATE: 'GET_UPDATES'
          }
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

  test('No update found ends the state machine', async () => {
    const stateMachine = new StateMachine(
      {
        ...stateAndTransitions,
        GET_UPDATES: {
          ...stateAndTransitions.GET_UPDATES,
          action: () => 'NO_UPDATE_FOUND'
        }
      },
      initialState
    );
    jest.spyOn(stateMachine, 'emit');

    expect(stateMachine.currentState).toBe(undefined);
    await stateMachine.start();
    expect(stateMachine.emit).toHaveBeenCalledWith('GET_UPDATES');
    expect(stateMachine.emit).toHaveBeenCalledWith('END');
    expect(stateMachine.currentState).toBe('END');
  });

  test('Update found and checks installed version', async () => {
    const stateMachine = new StateMachine(
      {
        ...stateAndTransitions,
        GET_UPDATES: {
          ...stateAndTransitions.GET_UPDATES,
          action: () => 'UPDATE_FOUND'
        }
      },
      initialState
    );
    jest.spyOn(stateMachine, 'emit');

    expect(stateMachine.currentState).toBe(undefined);
    await stateMachine.start();
    expect(stateMachine.emit).toHaveBeenCalledWith('GET_UPDATES');
    expect(stateMachine.emit).toHaveBeenCalledWith(
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
          action: () => 'UPDATE_FOUND'
        },
        CHECK_INSTALLED_COS_VERSION: {
          ...stateAndTransitions.CHECK_INSTALLED_COS_VERSION,
          action: () => 'VERSION_NOT_OK'
        },
        CHECK_COS_UPDATES: {
          ...stateAndTransitions.CHECK_COS_UPDATES,
          action: () => 'UPDATE_NOT_AVAILABLE'
        },
        START_DOWNLOAD_COS_UPDATES: {
          ...stateAndTransitions.START_DOWNLOAD_COS_UPDATES,
          action: () => 'COS_DOWNLOAD_STARTED'
        },
        VALIDATE_COS_DOWNLOAD: {
          ...stateAndTransitions.VALIDATE_COS_DOWNLOAD,
          action: () => 'COS_DOWNLOADED'
        },
        APPLY_COS_UPDATES: {
          ...stateAndTransitions.APPLY_COS_UPDATES,
          action: () => 'INSTALLING_COS'
        },
        WAITING_FOR_SYSTEM_RESTART: {
          ...stateAndTransitions.WAITING_FOR_SYSTEM_RESTART,
          action: () => 'SYSTEM_RESTARTED'
        },
        APPLY_MODULE_UPDATES: {
          ...stateAndTransitions.APPLY_MODULE_UPDATES,
          action: () => 'MODULE_UPDATE_APPLIED'
        },
        WAIT_FOR_MODULE_UPDATE: {
          ...stateAndTransitions.WAIT_FOR_MODULE_UPDATE,
          action: () => 'SUCCESS'
        }
      },
      initialState
    );
    jest.spyOn(stateMachine, 'emit');

    expect(stateMachine.currentState).toBe(undefined);
    await stateMachine.start();
    expect(stateMachine.emit).toHaveBeenCalledWith('GET_UPDATES');
    expect(stateMachine.emit).toHaveBeenCalledWith(
      'CHECK_INSTALLED_COS_VERSION'
    );
    expect(stateMachine.emit).toHaveBeenCalledWith('CHECK_COS_UPDATES');
    expect(stateMachine.emit).toHaveBeenCalledWith(
      'START_DOWNLOAD_COS_UPDATES'
    );
    expect(stateMachine.emit).toHaveBeenCalledWith('VALIDATE_COS_DOWNLOAD');
    expect(stateMachine.emit).toHaveBeenCalledWith('APPLY_COS_UPDATES');
    expect(stateMachine.emit).toHaveBeenCalledWith(
      'WAITING_FOR_SYSTEM_RESTART'
    );
    expect(stateMachine.emit).toHaveBeenCalledWith('APPLY_MODULE_UPDATES');
    expect(stateMachine.emit).toHaveBeenCalledWith('WAIT_FOR_MODULE_UPDATE');
    expect(stateMachine.currentState).toBe('END');
  });
});
