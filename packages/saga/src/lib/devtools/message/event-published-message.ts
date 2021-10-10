import { Message } from './message';
import { IEvent } from '../../event/event';

export interface EventPublishedMessage extends Message {
  readonly type: 'EVENT_PUBLISHED';
  readonly event: {
    readonly name: string;
    readonly payload: IEvent;
  };
}
