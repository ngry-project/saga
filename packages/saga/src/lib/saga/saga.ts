import { Observable } from 'rxjs';
import { Type } from '@angular/core';
import { ICommand } from '../command/command';
import { IEvent } from '../event/event';

/**
 * Represents a saga.
 * Sagas respond to events of specific type by making a _decision_ on which command(s) should be executed next.
 * In a nutshell, sagas transform stream of specific events to a stream of commands.
 */
export interface ISaga<TEvent extends IEvent = IEvent> {
  /**
   * Gets a type of event this saga responds to.
   */
  readonly handles: Type<TEvent>;

  readonly within?: TEvent extends IEvent<infer TContext> ? Type<TContext> : never;

  /**
   * Decides which command(s) should be executed in response to the given event.
   * @param event$ A stream which emits an event of the given type, then completes.
   */
  handle(event$: Observable<TEvent>): Observable<ICommand>;
}
