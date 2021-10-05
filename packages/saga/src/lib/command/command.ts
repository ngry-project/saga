
/**
 * Represents a command.
 * Commands carry all the data needed to execute the command in a form of a plain data object.
 */
export interface ICommand<TContext extends object = object> {
  /**
   * Gets a context this command is a part of.
   */
  readonly context: TContext;
}
