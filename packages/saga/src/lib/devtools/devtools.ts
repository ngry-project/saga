import { fromEvent, Observable, Subject } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Message } from './message/message';
import { DevtoolsReadyMessage } from './message/devtools-ready-message';
import { DevtoolsMessageMessage } from './message/devtools-message-message';
import { ClientReadyMessage } from './message/client-ready-message';
import { ClientMessageMessage } from './message/client-message-message';
import { DEVTOOLS_ID } from './devtools.constants';

@Injectable({
  providedIn: 'root',
})
export class Devtools {
  private readonly ready$$ = new Subject<void>();
  private readonly messages$$ = new Subject<Message>();

  readonly ready$: Observable<void> = this.ready$$.asObservable();
  readonly messages$: Observable<Message> = this.messages$$.asObservable();

  constructor(
    @Inject(DOCUMENT)
    private readonly document: Document,
  ) {
    if (this.document.defaultView) {
      fromEvent<MessageEvent>(this.document.defaultView, 'message')
        .pipe(
          filter((event): event is MessageEvent<Message> => event.data?.source === DEVTOOLS_ID),
          filter((event): event is MessageEvent<DevtoolsReadyMessage> => event.data.type === 'DEVTOOLS_READY'),
          tap(() => this.ready$$.next()),
        )
        .subscribe();

      fromEvent<MessageEvent>(this.document.defaultView, 'message')
        .pipe(
          filter((event): event is MessageEvent<Message> => event.data?.source === DEVTOOLS_ID),
          filter((event): event is MessageEvent<DevtoolsMessageMessage> => event.data.type === 'DEVTOOLS_MESSAGE'),
          tap((event) => this.messages$$.next(event.data.message)),
        )
        .subscribe();

      this.document.defaultView.postMessage(
        {
          source: DEVTOOLS_ID,
          type: 'CLIENT_READY',
        } as ClientReadyMessage,
        '*',
      );
    }
  }

  send<TMessage extends Message>(message: TMessage) {
    this.document.defaultView?.postMessage(
      {
        source: DEVTOOLS_ID,
        type: 'CLIENT_MESSAGE',
        message,
      } as ClientMessageMessage,
      '*',
    );
  }
}
