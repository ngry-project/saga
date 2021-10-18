import { Observable, Subscription, Unsubscribable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ICommand } from '../command/command';
import { IEvent } from './event';
import { EventHandlerMetadata } from './event-handler-metadata';
import { EventHandlerRegistrar } from './event-handler-registrar';

/**
 * @internal
 */
@Injectable({
  providedIn: 'root',
})
export class EventHandlerScanner {
  constructor(private readonly registrar: EventHandlerRegistrar) {}

  scan(source: object): Unsubscribable {
    const metadata = EventHandlerMetadata.of(source.constructor.prototype);
    const subscription = new Subscription();

    for (const [methodKey, handles] of metadata.handlers) {
      subscription.add(
        this.registrar.register({
          handles,
          handle(event$: Observable<IEvent>): Observable<ICommand> {
            return (source as any)[methodKey](event$);
          },
        }),
      );
    }

    return subscription;
  }
}
