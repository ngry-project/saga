
/**
 * Represents an event.
 * Events carry all the data needed to describe the change or intent in form of a plain data object.
 */
export interface IEvent<TContext extends object = object> {
  /**
   * Gets a context this event is a part of.
   */
  readonly context: TContext;
}
