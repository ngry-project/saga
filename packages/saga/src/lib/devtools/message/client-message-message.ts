import { Message } from './message';
import { DEVTOOLS_ID } from '../devtools.constants';

export interface ClientMessageMessage extends Message {
  readonly source: typeof DEVTOOLS_ID;
  readonly type: 'CLIENT_MESSAGE';
  readonly message: Message;
}
