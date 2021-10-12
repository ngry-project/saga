import { Message } from './message';
import { ICommand } from '../../command/command';
import { CommandMetadata } from '../../command/command-metadata';

export interface CommandPublishedMessage extends Message {
  readonly type: 'COMMAND_PUBLISHED';
  readonly command: {
    readonly name: string;
    readonly metadata: CommandMetadata;
    readonly payload: ICommand;
  };
}
