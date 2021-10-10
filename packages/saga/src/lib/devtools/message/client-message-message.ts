import { Message } from './message';

export interface ClientMessageMessage extends Message {
  readonly source: string;
  readonly type: 'CLIENT_MESSAGE';
  readonly message: Message;
}
