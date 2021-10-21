import { Message } from './message';
import { DEVTOOLS_ID } from '../devtools.constants';

export interface DevtoolsReadyMessage extends Message {
  readonly source: typeof DEVTOOLS_ID;
  readonly type: 'DEVTOOLS_READY';
}
