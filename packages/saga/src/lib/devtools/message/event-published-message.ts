import { Message } from './message';
import { EventDto } from './event-dto';

export interface EventPublishedMessage extends Message {
  readonly type: 'EVENT_PUBLISHED';
  readonly event: EventDto;
}
