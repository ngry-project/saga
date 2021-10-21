import { Message } from './message';
import { CommandDto } from './command-dto';

export interface CommandPublishedMessage extends Message {
  readonly type: 'COMMAND_PUBLISHED';
  readonly command: CommandDto;
}
