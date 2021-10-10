import { Observable, Subject } from 'rxjs';
import { Inject, Injectable, Optional } from '@angular/core';
import { SAGA_ROOT_OPTIONS, SagaRootOptions } from '../configuration/saga-root-options';
import { ICommand } from './command';
import { CommandHandlerRegistry } from './command-handler-registry';

/**
 * Represents a command bus.
 * Command bus transmits all commands of the app.
 */
@Injectable({
  providedIn: 'root',
})
export class CommandBus {
  private readonly _commands$ = new Subject<ICommand>();

  /**
   * Gets a stream of all commands.
   */
  readonly commands$: Observable<ICommand> = this._commands$.asObservable();

  constructor(
    private readonly registry: CommandHandlerRegistry,
    @Inject(SAGA_ROOT_OPTIONS)
    @Optional()
    private readonly options?: SagaRootOptions,
  ) {}

  /**
   * Publishes the given command.
   * Commands are being published asynchronously (in the next microtask) to preserve correct order.
   */
  execute<TCommand extends ICommand>(command: TCommand): Promise<void | never> {
    return Promise.resolve().then(() => {
      if (this.options?.debug) {
        console.log(new Date().toISOString(), command);
      }

      this.registry.resolve(command);

      this._commands$.next(command);
    });
  }
}
