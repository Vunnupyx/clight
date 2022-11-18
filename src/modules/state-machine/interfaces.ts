export interface StateAndTransitions {
  [key: string]: {
    action: Function;
    transitions: {
      [key: string]: string;
    };
  };
}
