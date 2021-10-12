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

  register(publisher: IEventPublisher) {
    this.registry.register(publisher);

    publisher.events$.subscribe((event) => this.eventBus.publish(event));
  }

  scan(saga: object) {
    const metadata = SagaMetadata.of(saga.constructor.prototype);

    if (metadata) {
      for (const propertyKey of metadata.eventPublishers) {
        this.register({
          events$: (saga as any)[propertyKey],
        });
      }
    }
  }
}
