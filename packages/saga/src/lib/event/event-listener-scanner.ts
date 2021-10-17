import { Subscription, Unsubscribable } from 'rxjs';
import { Injectable } from '@angular/core';
import { IEvent } from './event';
import { EventListenerMetadata } from './event-listener-metadata';
import { EventListenerRegistrar } from './event-listener-registrar';

/**
 * @internal
 */
@Injectable({
  providedIn: 'root',
})
export class EventListenerScanner {
  constructor(private readonly registrar: EventListenerRegistrar) {}

  scan(source: object): Unsubscribable {
    const metadata = EventListenerMetadata.of(source.constructor.prototype);
    const subscription = new Subscription();

    for (const [methodKey, listensTo] of metadata.listeners) {
      subscription.add(
        this.registrar.register({
          listensTo,
          on(event: IEvent) {
            (source as any)[methodKey](event);
          },
        }),
      );
    }

    return subscription;
  }
}
