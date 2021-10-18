import { Type } from '@angular/core';
import { IEvent } from './event';

export interface IEventListener<TEvent extends IEvent = IEvent> {
  readonly listensTo: Type<TEvent>;

  on(event: TEvent): void;
}
