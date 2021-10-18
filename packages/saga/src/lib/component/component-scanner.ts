import { Subscription, Unsubscribable } from 'rxjs';
import { Injectable } from '@angular/core';
import { EventListenerScanner } from '../event/event-listener-scanner';
import { EventPublisherScanner } from '../event/event-publisher-scanner';

@Injectable({
  providedIn: 'root',
})
export class ComponentScanner {
  constructor(
    private readonly eventListenerScanner: EventListenerScanner,
    private readonly eventPublisherScanner: EventPublisherScanner,
  ) {}

  scan(component: object): Unsubscribable {
    const subscription = new Subscription();

    subscription.add(this.eventListenerScanner.scan(component));
    subscription.add(this.eventPublisherScanner.scan(component));

    return subscription;
  }
}
