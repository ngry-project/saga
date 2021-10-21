import { EventMetadata } from '../../event/event-metadata';
import { IEvent } from '../../event/event';

export interface EventDto {
  readonly type: 'event';
  readonly name: string;
  readonly metadata: EventMetadata | undefined;
  readonly payload: IEvent;
}
