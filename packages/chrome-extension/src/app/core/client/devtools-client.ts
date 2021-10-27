import { BehaviorSubject, Subject } from 'rxjs';
import { ApplicationRef, Injectable } from '@angular/core';
import { ClientMessage, DEVTOOLS_ID, DevtoolsMessageMessage, DevtoolsReadyMessage, Message } from '@ngry/saga';

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

  constructor(appRef: ApplicationRef) {
    this.port = chrome.runtime.connect({
      name: this.PORT_NAME,
    });

    this.port.onMessage.addListener((message: ClientMessage) => {
      if (message.source === DEVTOOLS_ID) {
        if (message.type === 'CLIENT_READY') {
          this.ready$$.next(true);
          appRef.tick();
        }

        if (message.type === 'CLIENT_MESSAGE') {
          this.messages$$.next(message.message);
          appRef.tick();
        }
      }
    });

    const _message: DevtoolsReadyMessage = {
      source: DEVTOOLS_ID,
      type: 'DEVTOOLS_READY',
      tabId: chrome.devtools.inspectedWindow.tabId,
    };

    this.port.postMessage(_message);
  }

  send<TMessage extends Message>(message: TMessage) {
    const _message: DevtoolsMessageMessage = {
      source: DEVTOOLS_ID,
      type: 'DEVTOOLS_MESSAGE',
      message,
    };

    this.port.postMessage(_message);
  }
}
