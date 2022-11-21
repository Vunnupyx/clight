export interface StateAndTransitions {
  [key: string]: {
    transition: Function;
    transitions: {
      [key: string]: string;
    };
  };
}
