import { Observable, Subject } from 'rxjs';
import { Inject, Injectable, Optional } from '@angular/core';
import { IEvent } from './event';
import { SAGA_ROOT_MODULE_OPTIONS, SagaRootModuleOptions } from '../configuration/saga-root-module-options';

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
    @Inject(SAGA_ROOT_MODULE_OPTIONS) @Optional()
    private readonly configuration?: SagaRootModuleOptions,
  ) {
  }

  /**
   * Publishes the given event.
   * Events are being published asynchronously (in the next microtask) to preserve correct order.
   */
  publish(event: IEvent): Promise<void> {
    return Promise.resolve().then(() => {
      if (this.configuration?.debug) {
        console.log(new Date().toISOString(), event);
      }

      this._events$.next(event);
    });
  }
}
