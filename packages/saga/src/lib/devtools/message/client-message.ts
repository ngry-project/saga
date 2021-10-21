import { ClientMessageMessage, ClientReadyMessage } from '@ngry/saga';

export type ClientMessage = ClientReadyMessage | ClientMessageMessage;
