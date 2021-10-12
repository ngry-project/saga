import { Message } from './message';
import { IEvent } from '../../event/event';
import { EventMetadata } from '../../event/event-metadata';

export interface EventPublishedMessage extends Message {
  readonly type: 'EVENT_PUBLISHED';
  readonly event: {
    readonly name: string;
    readonly metadata: EventMetadata;
    readonly payload: IEvent;
  };
}
