import { Injectable, Type } from '@angular/core';
import { ICommand } from './command';
import { ICommandHandler } from './command-handler';

/**
 * Represents a registry of {@link ICommandHandler}.
 * Guarantees each command type has only one corresponding command handler.
 * @internal
 */
@Injectable({
  providedIn: 'root',
})
export class CommandHandlerRegistry {
  private readonly handlers = new Map<Type<ICommand>, ICommandHandler>();

  get length(): number {
    return this.handlers.size;
  }

  /**
   * Resolves an {@link ICommandHandler} responsible for execution of the given command.
   * @param command Command to resolve an {@link ICommandHandler} for.
   * @throws {Error} When no corresponding handler for the command was found.
   */
  resolve(command: ICommand): ICommandHandler | never {
    const type = command.constructor as Type<ICommand>;
    const handler = this.handlers.get(type);

    if (!handler) {
      throw new Error(`No corresponding handler found for command ${type.name}`);
    }

    return handler;
  }

  /**
   * Register the given command handler. Only one handler per command is allowed.
   * Registration of yet another handler for the same command type will cause an error.
   * @param handler Command handler to register in this registry.
   * @throws {Error} When command type already has a corresponding handler.
   */
  register(handler: ICommandHandler): void | never {
    if (this.handlers.has(handler.executes)) {
      throw new Error(`Command ${handler.executes.name} already has a corresponding handler`);
    }

    this.handlers.set(handler.executes, handler);
  }

  unregister(handler: ICommandHandler): void | never {
    if (!this.handlers.has(handler.executes)) {
      throw new Error(`Command handler for ${handler.executes.name} is not registered`);
    }

    this.handlers.delete(handler.executes);
  }
}
