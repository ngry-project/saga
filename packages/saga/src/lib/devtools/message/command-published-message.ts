import { Message } from './message';
import { ICommand } from '../../command/command';

export interface CommandPublishedMessage extends Message {
  readonly type: 'COMMAND_PUBLISHED';
  readonly command: {
    readonly name: string;
    readonly payload: ICommand;
  };
}
