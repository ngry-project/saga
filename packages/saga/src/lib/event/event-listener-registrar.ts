import { Subscription, Unsubscribable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { IEvent } from './event';
import { EventBus } from './event-bus';
import { IEventListener } from './event-listener';
import { EventListenerRegistry } from './event-listener-registry';
import { SagaMetadata } from '../saga/saga-metadata';

@Injectable({
  providedIn: 'root',
})
export class EventListenerRegistrar {
  constructor(private readonly registry: EventListenerRegistry, private readonly eventBus: EventBus) {}

  register(listener: IEventListener): Unsubscribable {
    this.registry.register(listener);

    const subscription = this.eventBus.events$
      .pipe(
        filter((event) => event instanceof listener.listensTo),
        tap((event) => listener.on(event)),
      )
      .subscribe();

    subscription.add(() => {
      this.registry.unregister(listener);
    });

    return subscription;
  }

  scan(saga: object): Unsubscribable {
    const metadata = SagaMetadata.of(saga.constructor.prototype);
    const subscription = new Subscription();

    for (const [methodKey, listensTo] of metadata.eventListeners) {
      subscription.add(
        this.register({
          listensTo,
          on(event: IEvent) {
            (saga as any)[methodKey](event);
          },
        }),
      );
    }

    return subscription;
  }
}
