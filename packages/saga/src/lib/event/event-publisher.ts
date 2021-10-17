import { Observable } from 'rxjs';
import { IEvent } from './event';

export interface IEventPublisher<TEvent extends IEvent = IEvent> {
  readonly events$: Observable<TEvent>;
}
