import { Message } from './message';

export interface DevtoolsMessageMessage extends Message {
  readonly source: string;
  readonly type: 'DEVTOOLS_MESSAGE';
  readonly message: Message;
}
