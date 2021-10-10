import { Observable } from 'rxjs';
import { Type } from '@angular/core';
import { ICommand } from './command';
import { IEvent } from '../event/event';

/**
 * Represents a generic command handler.
 * Command handlers execute commands of specific type.
 */
export interface ICommandHandler<TCommand extends ICommand = ICommand> {
  /**
   * Gets a type of command this handler executes.
   */
  readonly executes: Type<TCommand>;

  /**
   * Builds a command execution pipeline.
   * @param command$ A stream which emits a single command of specific type, then completes.
   */
  execute(command$: Observable<TCommand>): Observable<IEvent>;
}
