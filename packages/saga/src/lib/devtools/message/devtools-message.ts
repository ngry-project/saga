import { DevtoolsMessageMessage } from './devtools-message-message';
import { DevtoolsReadyMessage } from './devtools-ready-message';

export type DevtoolsMessage = DevtoolsReadyMessage | DevtoolsMessageMessage;
