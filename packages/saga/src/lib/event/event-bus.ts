import { Observable, Subject } from 'rxjs';
import { Inject, Injectable, Optional } from '@angular/core';
import { SAGA_ROOT_OPTIONS, SagaRootOptions } from '../configuration/saga-root-options';
import { IEvent } from './event';
import { EventRepository } from './event-repository';

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
    @Inject(SAGA_ROOT_OPTIONS)
    @Optional()
    private readonly options?: SagaRootOptions,
  ) {}

  /**
   * Publishes the given event.
   * Events are being published asynchronously (in the next microtask) to preserve correct order.
   */
  publish<TEvent extends IEvent>(event: TEvent): Promise<void> {
    return Promise.resolve().then(() => {
      this.eventRepository.persist(event);

      if (this.options?.debug) {
        console.log(new Date().toISOString(), event);
      }

      this._events$.next(event);
    });
  }
}
