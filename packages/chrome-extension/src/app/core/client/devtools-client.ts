import { BehaviorSubject, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  ClientMessageMessage,
  ClientReadyMessage,
  DEVTOOLS_ID,
  DevtoolsMessageMessage,
  DevtoolsReadyMessage,
  Message,
} from '@ngry/saga';

@Injectable({
  providedIn: 'root',
})
export class DevtoolsClient {
  private readonly PORT_NAME = 'Saga Devtools';

  private readonly port: chrome.runtime.Port;
  private readonly ready$$ = new BehaviorSubject<boolean>(false);
  private readonly messages$$ = new Subject<Message>();

  readonly ready$ = this.ready$$.asObservable();
  readonly messages$ = this.messages$$.asObservable();

  constructor() {
    this.port = chrome.runtime.connect({
      name: this.PORT_NAME,
    });

    this.port.onMessage.addListener((message: ClientReadyMessage | ClientMessageMessage) => {
      if (message.source === DEVTOOLS_ID) {
        if (message.type === 'CLIENT_READY') {
          this.ready$$.next(true);
        }

        if (message.type === 'CLIENT_MESSAGE') {
          this.messages$$.next(message.message);
        }
      }
    });

    this.port.postMessage({
      source: DEVTOOLS_ID,
      type: 'DEVTOOLS_READY',
      tabId: chrome.devtools.inspectedWindow.tabId,
    } as DevtoolsReadyMessage);
  }

  send<TMessage extends Message>(message: TMessage) {
    this.port.postMessage({
      source: DEVTOOLS_ID,
      type: 'DEVTOOLS_MESSAGE',
      message,
    } as DevtoolsMessageMessage);
  }
}
