import { Observable, Subject } from 'rxjs';
import { Inject, Injectable, Optional } from '@angular/core';
import { ICommand } from './command';
import { CommandHandlerRegistry } from './command-handler-registry';
import { SAGA_ROOT_MODULE_OPTIONS, SagaRootModuleOptions } from '../configuration/saga-root-module-options';

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
    @Inject(SAGA_ROOT_MODULE_OPTIONS) @Optional()
    private readonly configuration?: SagaRootModuleOptions,
  ) {
  }

  /**
   * Publishes the given command.
   * Commands are being published asynchronously (in the next microtask) to preserve correct order.
   */
  execute(command: ICommand): Promise<void | never> {
    return Promise.resolve().then(() => {
      if (this.configuration?.debug) {
        console.log(new Date().toISOString(), command);
      }

      this.registry.resolve(command);

      this._commands$.next(command);
    });
  }
}
