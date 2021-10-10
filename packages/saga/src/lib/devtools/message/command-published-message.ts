import { Message } from './message';

export interface CommandPublishedMessage extends Message {
  readonly type: 'COMMAND_PUBLISHED';
}
