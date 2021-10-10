import { Message } from './message';

export interface ClientReadyMessage extends Message {
  readonly source: string;
  readonly type: 'CLIENT_READY';
}
