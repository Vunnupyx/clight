export type TSubscriberFn<TEventType> = (event: TEventType) => Promise<void>;
