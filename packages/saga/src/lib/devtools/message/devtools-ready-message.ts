import { Message } from './message';

export interface DevtoolsReadyMessage extends Message {
  readonly source: string;
  readonly type: 'DEVTOOLS_READY';
}
