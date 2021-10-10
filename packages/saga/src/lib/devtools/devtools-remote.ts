import { fromEvent, Subject } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Message } from './message/message';
import { DevtoolsMessageMessage } from './message/devtools-message-message';
import { ClientReadyMessage } from './message/client-ready-message';
import { ClientMessageMessage } from './message/client-message-message';

@Injectable({
  providedIn: 'root',
})
export class DevtoolsRemote {
  private readonly SOURCE = 'SagaDevtools';

  private readonly messages$$ = new Subject<Message>();

  readonly messages$ = this.messages$$.asObservable();

  constructor(
    @Inject(DOCUMENT)
    private readonly document: Document,
  ) {
    if (this.document.defaultView) {
      fromEvent<MessageEvent>(this.document.defaultView, 'message')
        .pipe(
          filter((event): event is MessageEvent<Message> => event.data?.source === this.SOURCE),
          filter((event): event is MessageEvent<DevtoolsMessageMessage> => event.data.type === 'DEVTOOLS_MESSAGE'),
          tap((event) => this.messages$$.next(event.data.message)),
        )
        .subscribe();

      this.document.defaultView.postMessage(
        {
          source: this.SOURCE,
          type: 'CLIENT_READY',
        } as ClientReadyMessage,
        '*',
      );
    }
  }

  send<TMessage extends Message>(message: TMessage) {
    this.document.defaultView?.postMessage(
      {
        source: this.SOURCE,
        type: 'CLIENT_MESSAGE',
        message,
      } as ClientMessageMessage,
      '*',
    );
  }
}
