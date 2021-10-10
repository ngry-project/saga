import { Message } from './message';

export interface EventPublishedMessage extends Message {
  readonly type: 'EVENT_PUBLISHED';
}
