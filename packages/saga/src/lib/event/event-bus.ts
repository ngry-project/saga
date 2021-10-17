import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { IEvent } from './event';
import { EventRepository } from './event-repository';
import { EventHandlerRegistry } from './event-handler-registry';

/**
 * Represents an event bus.
 * Event bus transmits all events of the app.
 */
@Injectable({
  providedIn: 'root',
})
export class EventBus {
  private readonly _events$ = new Subject<IEvent>();

  /**
   * Gets a stream of all events.
   */
  readonly events$: Observable<IEvent> = this._events$.asObservable();

  constructor(
    private readonly eventRepository: EventRepository,
    private readonly eventHandlerRegistry: EventHandlerRegistry,
  ) {}

  /**
   * Publishes the given event.
   * Events are being published asynchronously (in the next microtask) to preserve correct order.
   */
  publish<TEvent extends IEvent>(event: TEvent): Promise<void> {
    return Promise.resolve().then(() => {
      this.eventHandlerRegistry.resolve(event);
      this.eventRepository.persist(event);

      this._events$.next(event);
    });
  }
}
