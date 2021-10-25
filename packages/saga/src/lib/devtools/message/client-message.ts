import { ClientReadyMessage } from './client-ready-message';
import { ClientMessageMessage } from './client-message-message';

export type ClientMessage = ClientReadyMessage | ClientMessageMessage;
