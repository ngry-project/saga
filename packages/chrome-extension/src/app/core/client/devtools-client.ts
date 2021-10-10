import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  ClientMessageMessage,
  ClientReadyMessage,
  DevtoolsMessageMessage,
  DevtoolsReadyMessage,
  Message,
} from '@ngry/saga';

@Injectable({
  providedIn: 'root',
})
export class DevtoolsClient {
  private readonly SOURCE = 'SagaDevtools';

  private readonly port: chrome.runtime.Port;
  private readonly messages$$ = new Subject<Message>();

  readonly messages$ = this.messages$$.asObservable();

  constructor() {
    this.port = chrome.runtime.connect({
      name: 'Saga Devtools',
    });

    this.port.onMessage.addListener((message: ClientReadyMessage | ClientMessageMessage) => {
      if (message.source === this.SOURCE) {
        if (message.type === 'CLIENT_MESSAGE') {
          this.messages$$.next(message.message);
        }
      }
    });

    this.port.postMessage({
      source: this.SOURCE,
      type: 'DEVTOOLS_READY',
      tabId: chrome.devtools.inspectedWindow.tabId,
    } as DevtoolsReadyMessage);
  }

  send<TMessage extends Message>(message: TMessage) {
    this.port.postMessage({
      source: this.SOURCE,
      type: 'DEVTOOLS_MESSAGE',
      message,
    } as DevtoolsMessageMessage);
  }
}
