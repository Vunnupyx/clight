import { EventEmitter } from 'events';

import { StateAndTransitions } from './interfaces';

export class StateMachine extends EventEmitter {
  public currentState: string;

  constructor(
    private stateAndTransitions: StateAndTransitions,
    private initialState: string = 'INIT',
    private isInfiniteLoop: boolean = false
  ) {
    super();
  }

  public async start() {
    this.currentState = this.initialState;

    while (true) {
      try {
        const command = await this.executeCurrentStep();

        let nextState =
          command === 'END'
            ? command
            : this.stateAndTransitions[this.currentState]?.transitions?.[
                command
              ];

        if (!nextState) {
          console.log('nextState missing');
          nextState = 'END';
        }
        this.currentState = nextState;
        this.emit(nextState);

        if (this.currentState === 'END') {
          if (this.isInfiniteLoop) {
            this.currentState = this.initialState;
          } else {
            break;
          }
        }
      } catch (e) {
        console.log(e);
        throw e;
      }
    }
  }

  private async executeCurrentStep(): Promise<string> {
    const action = this.stateAndTransitions?.[this.currentState]?.action;

    if (!action) {
      console.log('stateAction missing');
      return 'END';
    }

    const nextState = await action();
    return nextState;
  }
}
