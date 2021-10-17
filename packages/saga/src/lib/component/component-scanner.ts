import { Subscription, Unsubscribable } from 'rxjs';
import { Injectable } from '@angular/core';
import { EventListenerRegistrar } from '../event/event-listener-registrar';
import { EventPublisherRegistrar } from '../event/event-publisher-registrar';

@Injectable({
  providedIn: 'root',
})
export class ComponentScanner {
  constructor(
    private readonly eventListenerRegistrar: EventListenerRegistrar,
    private readonly eventPublisherRegistrar: EventPublisherRegistrar,
  ) {}

  scan(component: object): Unsubscribable {
    const subscription = new Subscription();

    subscription.add(this.eventListenerRegistrar.scan(component));
    subscription.add(this.eventPublisherRegistrar.scan(component));

    return subscription;
  }
}
