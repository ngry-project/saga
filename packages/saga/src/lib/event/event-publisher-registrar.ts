import { Subscription, Unsubscribable } from 'rxjs';
import { Injectable } from '@angular/core';
import { IEventPublisher } from './event-publisher';
import { EventBus } from './event-bus';
import { EventPublisherRegistry } from './event-publisher-registry';
import { SagaMetadata } from '../saga/saga-metadata';

/**
 * @internal
 */
@Injectable({
  providedIn: 'root',
})
export class EventPublisherRegistrar {
  constructor(private readonly registry: EventPublisherRegistry, private readonly eventBus: EventBus) {}

  register(publisher: IEventPublisher): Unsubscribable {
    this.registry.register(publisher);

    return publisher.events$.subscribe((event) => this.eventBus.publish(event));
  }

  scan(saga: object): Unsubscribable {
    const metadata = SagaMetadata.of(saga.constructor.prototype);
    const subscription = new Subscription();

    for (const propertyKey of metadata.eventPublishers) {
      subscription.add(
        this.register({
          events$: (saga as any)[propertyKey],
        }),
      );
    }

    return subscription;
  }
}
