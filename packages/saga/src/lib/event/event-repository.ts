import { Injectable } from '@angular/core';
import { EventMetadata } from './event-metadata';
import { IEvent } from './event';

const EVENT_METADATA = Symbol();

@Injectable({
  providedIn: 'root',
})
export class EventRepository {
  private nextId = 0;

  persist<TEvent extends IEvent>(event: TEvent, options: { sourceCommandId?: number } = {}): TEvent {
    if (!this.isPersisted(event)) {
      const { sourceCommandId } = options;
      const id = ++this.nextId;
      const metadata: EventMetadata = { id, sourceCommandId };

      Object.defineProperty(event, EVENT_METADATA, {
        value: metadata,
        enumerable: false,
      });
    }

    return event;
  }

  isPersisted(event: IEvent): boolean {
    return this.getMetadata(event) != null;
  }

  getId(event: IEvent): number | undefined {
    return this.getMetadata(event)?.id;
  }

  hasId(event: IEvent): boolean {
    return this.getId(event) != null;
  }

  getMetadata(event: IEvent): EventMetadata | undefined {
    return (event as any)[EVENT_METADATA];
  }

  hasMetadata(event: IEvent): boolean {
    return EVENT_METADATA in event;
  }
}
