import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { ICommand } from './command';
import { CommandHandlerRegistry } from './command-handler-registry';
import { CommandRepository } from './command-repository';

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
    private readonly commandHandlerRegistry: CommandHandlerRegistry,
    private readonly commandRepository: CommandRepository,
  ) {}

  /**
   * Publishes the given command.
   * Commands are being published asynchronously (in the next microtask) to preserve correct order.
   */
  execute<TCommand extends ICommand>(command: TCommand): Promise<void | never> {
    return Promise.resolve().then(() => {
      this.commandHandlerRegistry.resolve(command);
      this.commandRepository.persist(command);

      this._commands$.next(command);
    });
  }
}
