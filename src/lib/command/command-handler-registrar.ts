import { EMPTY, of } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ofType } from '@ngry/rx';
import { ICommandHandler } from './command-handler';
import { CommandBus } from './command-bus';
import { CommandHandlerRegistry } from './command-handler-registry';

/**
 * Represents a command handler registrar.
 * Registers command handlers in {@link CommandHandlerRegistry} to ensure command of specific type has only one handler.
 * Subscribes command handlers to {@link CommandBus} to execute published commands of specific type.
 * @internal
 */
@Injectable({
  providedIn: 'root',
})
export class CommandHandlerRegistrar {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly registry: CommandHandlerRegistry,
  ) {
  }

  /**
   * Registers given command handler in {@link CommandHandlerRegistry} to ensure command of specific type has only one handler.
   * Subscribes given command handler to {@link CommandBus} to execute published commands of specific type.
   */
  register(handler: ICommandHandler): void {
    this.registry.register(handler);

    this.commandBus.commands$.pipe(
      ofType(handler.executes),
      mergeMap(command => handler.execute(of(command)).pipe(
        catchError(error => {
          if (handler.rollback) {
            return handler.rollback(of(command), error);
          } else {
            return EMPTY;
          }
        }),
      )),
    ).subscribe();
  }
}
