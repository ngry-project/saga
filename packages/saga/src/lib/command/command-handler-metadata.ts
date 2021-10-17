import 'reflect-metadata';
import { Type } from '@angular/core';
import { ICommand } from './command';

const COMMAND_HANDLER_METADATA = Symbol();

/**
 * Represents a command handler metadata.
 * Registers command handling methods decorated with {@link CommandHandler} decorator.
 * @internal
 */
export class CommandHandlerMetadata {
  private readonly _handlers = new Map<PropertyKey, Type<ICommand>>();

  /**
   * Gets all mappings between names of command executing methods decorated with {@link CommandHandler} decorator and
   * types of commands these methods are responsible to execute.
   */
  get handlers(): ReadonlyMap<PropertyKey, Type<ICommand>> {
    return this._handlers;
  }

  /**
   * Gets command handler metadata by "reflecting" it from the prototype.
   * @param target Prototype of the class to get command handler metadata from.
   */
  static of(target: object): CommandHandlerMetadata {
    let metadata: CommandHandlerMetadata | undefined = Reflect.getMetadata(COMMAND_HANDLER_METADATA, target);

    if (!metadata) {
      metadata = new CommandHandlerMetadata();

      Reflect.defineMetadata(COMMAND_HANDLER_METADATA, metadata, target);
    }

    return metadata;
  }

  /**
   * Registers a mapping between the name of a command executing method and the type of command it executes.
   * @param methodKey The name of the command executing method
   * @param executes The type of the command it executes
   */
  set(methodKey: PropertyKey, executes: Type<ICommand>) {
    this._handlers.set(methodKey, executes);
  }
}
