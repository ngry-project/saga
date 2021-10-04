import 'reflect-metadata';
import { Type } from '@angular/core';
import { ICommand } from './command';

export const COMMAND_HANDLER_METADATA = Symbol();

export class CommandHandlerMetadata {
  readonly handlers = new Map<PropertyKey, Type<ICommand>>();
}

export function CommandHandler(executes: Type<ICommand>): MethodDecorator {
  return (target, propertyKey) => {
    let metadata: CommandHandlerMetadata | undefined = Reflect.getMetadata(COMMAND_HANDLER_METADATA, target);

    if (!metadata) {
      metadata = new CommandHandlerMetadata();

      Reflect.defineMetadata(COMMAND_HANDLER_METADATA, metadata, target);
    }

    metadata.handlers.set(propertyKey, executes);
  };
}
