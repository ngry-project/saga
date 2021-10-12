import { Observable } from 'rxjs';
import { Type } from '@angular/core';
import { ICommand } from '../command/command';
import { IEvent } from './event';

/**
 * Represents an event handler.
 * Event handlers respond to events of specific type by making a _decision_ on which command(s) should be executed next.
 */
export interface IEventHandler<TEvent extends IEvent = IEvent> {
  /**
   * Gets a type of event this handler responds to.
   */
  readonly handles: Type<TEvent>;

  /**
   * Decides which command(s) should be executed in response to the given event.
   * @param event$ A stream which emits an event of the given type, then completes.
   */
  handle(event$: Observable<TEvent>): Observable<ICommand>;
}
