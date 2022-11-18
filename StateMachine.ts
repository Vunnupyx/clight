const transitions = [
  {
    fromState: 'INIT',
    command: 'START_UPDATE',
    toState: 'GET_UPDATES'
  }
];
const states = [
  {
    id: 'INIT',
    function: async () => {
      return 'START_UPDATE';
    }
  },
  {
    id: 'GET_UPDATES',
    function: async () => {
      return 'UPDATE_FOUND';
    }
  }
];

const initialState = 'INIT';

class StateMachine {
  states;
  transitions;
  initialState;

  constructor(states, transitions, initialState) {
    this.states = states;
    this.transitions = transitions;
    this.initialState = initialState;
  }

  async start() {
    let currentState = this.initialState;

    // While not terminated
    while (true) {
      const command = await this.executeStep(currentState);
      const nextState = this.transitions.find(
        (transition) => transition.command === command
      )?.toState;
      if (!nextState) throw new Error('invalid_command');
      currentState = nextState;
    }
  }

  async executeStep(currentState) {
    const stateFunction = this.states.find(
      (state) => state.id === currentState
    )?.function;
    if (!stateFunction) throw new Error('invalid_state');

    const command = await stateFunction();
    return command;
  }
}

const stateMachine = new StateMachine(states, transitions, initialState);
