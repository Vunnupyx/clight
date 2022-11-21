import { StateAndTransitions } from './interfaces';

export class StateMachine {
  private currentState: string;
  private endReason: string | undefined;

  constructor(
    private stateAndTransitions: StateAndTransitions,
    private onStateChange = (newState: string, endReason?: string) => {},
    private initialState = 'INIT',
    private isInfiniteLoop = false
  ) {}

  public async start() {
    this.currentState = this.initialState;

    while (true) {
      try {
        const transitionCommand = await this.executeCurrentStep();

        let nextState =
          transitionCommand === 'END'
            ? transitionCommand
            : this.stateAndTransitions[this.currentState]?.transitions?.[
                transitionCommand
              ];

        if (!nextState) {
          this.endReason = transitionCommand;
          nextState = 'END';
        } else if (nextState === 'END' && !this.endReason) {
          this.endReason = transitionCommand;
        }
        this.currentState = nextState;
        this.onStateChange(this.currentState, this.endReason);

        if (this.currentState === 'END') {
          if (this.isInfiniteLoop) {
            this.currentState = this.initialState;
          } else {
            break;
          }
        }
      } catch (e) {
        console.log(e);
        this.endReason = 'ERROR';
        const nextState = 'END';
        this.currentState = nextState;
        this.onStateChange(this.currentState, this.endReason);
      }
    }
  }

  private async executeCurrentStep(): Promise<string> {
    const transition =
      this.stateAndTransitions?.[this.currentState]?.transition;

    if (!transition) {
      console.log('transition function is missing');
      this.endReason = 'ERROR_WRONG_TRANSITION';
      return 'END';
    }

    const nextState = await transition();
    return nextState;
  }
}
