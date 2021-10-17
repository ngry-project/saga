import { Unsubscribable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { EventBus } from './event-bus';
import { IEventListener } from './event-listener';
import { EventListenerRegistry } from './event-listener-registry';

/**
 * @internal
 */
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
}
