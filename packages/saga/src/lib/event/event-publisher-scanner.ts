import { Injectable } from '@angular/core';
import { Subscription, Unsubscribable } from 'rxjs';
import { EventPublisherMetadata } from './event-publisher-metadata';
import { EventPublisherRegistrar } from './event-publisher-registrar';

/**
 * @internal
 */
@Injectable({
  providedIn: 'root',
})
export class EventPublisherScanner {
  constructor(private readonly registrar: EventPublisherRegistrar) {}

  scan(source: object): Unsubscribable {
    const metadata = EventPublisherMetadata.of(source.constructor.prototype);
    const subscription = new Subscription();

    for (const propertyKey of metadata.publishers) {
      subscription.add(
        this.registrar.register({
          events$: (source as any)[propertyKey],
        }),
      );
    }

    return subscription;
  }
}
