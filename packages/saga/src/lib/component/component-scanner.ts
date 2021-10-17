import { Subscription, Unsubscribable } from 'rxjs';
import { Injectable } from '@angular/core';
import { EventListenerScanner } from '../event/event-listener-scanner';
import { EventPublisherRegistrar } from '../event/event-publisher-registrar';

@Injectable({
  providedIn: 'root',
})
export class ComponentScanner {
  constructor(
    private readonly eventListenerScanner: EventListenerScanner,
    private readonly eventPublisherRegistrar: EventPublisherRegistrar,
  ) {}

  scan(component: object): Unsubscribable {
    const subscription = new Subscription();

    subscription.add(this.eventListenerScanner.scan(component));
    subscription.add(this.eventPublisherRegistrar.scan(component));

    return subscription;
  }
}
