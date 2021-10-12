import { Injectable } from '@angular/core';
import { ICommand } from './command';
import { CommandMetadata } from './command-metadata';

const COMMAND_METADATA = Symbol();

@Injectable({
  providedIn: 'root',
})
export class CommandRepository {
  private nextId = 0;

  persist<TCommand extends ICommand>(command: TCommand, options: { sourceEventId?: number } = {}): TCommand {
    if (!this.isPersisted(command)) {
      const { sourceEventId } = options;
      const id = this.nextId++;
      const metadata = new CommandMetadata(id, sourceEventId);

      Object.defineProperty(command, COMMAND_METADATA, {
        value: metadata,
        enumerable: false,
      });
    }

    return command;
  }

  isPersisted(command: ICommand): boolean {
    return this.getMetadata(command) != null;
  }

  getId(command: ICommand): number | undefined {
    return this.getMetadata(command)?.id;
  }

  getMetadata(command: ICommand): CommandMetadata | undefined {
    return (command as any)[COMMAND_METADATA];
  }
}
