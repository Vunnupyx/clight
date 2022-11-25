import { StateMachine, StateAndTransitions } from '..';

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

describe('State Machine', () => {
  const onStateChange = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Wrong initial state ends the state machine', async () => {
    const stateMachine = new StateMachine(
      stateAndTransitions,
      onStateChange,
      'WRONG'
    );

    await stateMachine.start();
    expect(onStateChange).toHaveBeenCalledWith('END', 'ERROR_WRONG_TRANSITION');
  });

  test('Unexpected transition response will throw', async () => {
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
    expect(onStateChange).not.toHaveBeenCalledWith('GET_UPDATES', undefined);
    expect(onStateChange).toHaveBeenCalledWith('END', 'FAILED');
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
      onStateChange
    );

    await stateMachine.start();
    expect(onStateChange).toHaveBeenCalledWith('GET_UPDATES', undefined);
    expect(onStateChange).toHaveBeenCalledWith('END', 'NO_UPDATE_FOUND');
  });

  test('Update found and installed version is ok', async () => {
    const stateMachine = new StateMachine(
      {
        ...stateAndTransitions,
        GET_UPDATES: {
          ...stateAndTransitions.GET_UPDATES,
          transition: () => 'UPDATE_FOUND'
        },
        CHECK_INSTALLED_COS_VERSION: {
          ...stateAndTransitions.CHECK_INSTALLED_COS_VERSION,
          transition: () => 'VERSION_OK'
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
      onStateChange
    );

    await stateMachine.start();
    expect(onStateChange).toHaveBeenCalledWith('GET_UPDATES', undefined);
    expect(onStateChange).toHaveBeenCalledWith(
      'CHECK_INSTALLED_COS_VERSION',
      undefined
    );
    expect(onStateChange).toHaveBeenCalledWith(
      'APPLY_MODULE_UPDATES',
      undefined
    );
    expect(onStateChange).toHaveBeenCalledWith(
      'WAIT_FOR_MODULE_UPDATE',
      undefined
    );
    expect(onStateChange).toHaveBeenCalledWith('END', 'SUCCESS');
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
      onStateChange
    );

    await stateMachine.start();
    expect(onStateChange).toHaveBeenCalledWith('GET_UPDATES', undefined);
    expect(onStateChange).toHaveBeenCalledWith(
      'CHECK_INSTALLED_COS_VERSION',
      undefined
    );
    expect(onStateChange).toHaveBeenCalledWith('CHECK_COS_UPDATES', undefined);
    expect(onStateChange).toHaveBeenCalledWith(
      'START_DOWNLOAD_COS_UPDATES',
      undefined
    );
    expect(onStateChange).toHaveBeenCalledWith(
      'VALIDATE_COS_DOWNLOAD',
      undefined
    );
    expect(onStateChange).toHaveBeenCalledWith('APPLY_COS_UPDATES', undefined);
    expect(onStateChange).toHaveBeenCalledWith(
      'WAITING_FOR_SYSTEM_RESTART',
      undefined
    );
    expect(onStateChange).toHaveBeenCalledWith(
      'APPLY_MODULE_UPDATES',
      undefined
    );
    expect(onStateChange).toHaveBeenCalledWith(
      'WAIT_FOR_MODULE_UPDATE',
      undefined
    );
    expect(onStateChange).toHaveBeenCalledWith('END', 'SUCCESS');
  });
});
