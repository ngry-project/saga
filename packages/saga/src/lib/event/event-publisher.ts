import { Observable } from 'rxjs';
import { IEvent } from './event';

export interface IEventPublisher {
  readonly events$: Observable<IEvent>;
}
