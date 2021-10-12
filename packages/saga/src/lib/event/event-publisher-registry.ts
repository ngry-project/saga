import { Injectable } from '@angular/core';
import { IEventPublisher } from './event-publisher';

/**
 * @internal
 */
@Injectable({
  providedIn: 'root',
})
export class EventPublisherRegistry {
  private readonly publishers = new Set<IEventPublisher>();

  register(publisher: IEventPublisher) {
    if (this.publishers.has(publisher)) {
      throw new Error(`${publisher.constructor.name} already registered`);
    }

    this.publishers.add(publisher);
  }
}
