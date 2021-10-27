import { Message } from './message';
import { DEVTOOLS_ID } from '../devtools.constants';

export interface ClientReadyMessage extends Message {
  readonly source: typeof DEVTOOLS_ID;
  readonly type: 'CLIENT_READY';
}
