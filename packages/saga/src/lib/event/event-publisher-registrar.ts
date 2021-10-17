import { Unsubscribable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { EventBus } from './event-bus';
import { IEventPublisher } from './event-publisher';
import { EventPublisherRegistry } from './event-publisher-registry';

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

    const subscription = publisher.events$.pipe(tap((event) => this.eventBus.publish(event))).subscribe();

    subscription.add(() => {
      this.registry.unregister(publisher);
    });

    return subscription;
  }
}
