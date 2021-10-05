import { Observable } from 'rxjs';
import { Type } from '@angular/core';
import { ICommand } from './command';

/**
 * Represents a generic command handler.
 * Command handlers execute commands of specific type.
 */
export interface ICommandHandler<TCommand extends ICommand = ICommand, TError = unknown> {
  /**
   * Gets a type of command this handler executes.
   */
  readonly executes: Type<TCommand>;

  /**
   * Builds a command execution pipeline.
   * In case the pipeline throws an error, it can be handled by {@link rollback} method.
   * @param command$ A stream which emits a single command of specific type, then completes.
   */
  execute(command$: Observable<TCommand>): Observable<unknown>;

  /**
   * Builds an error handling pipeline.
   * @param command$ A stream which emits a single command of specific type, then completes.
   * @param error An error thrown during command execution.
   */
  rollback?(command$: Observable<TCommand>, error: TError): Observable<unknown>;
}
