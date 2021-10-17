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

  get length(): number {
    return this.publishers.size;
  }

  has(publisher: IEventPublisher): boolean {
    return this.publishers.has(publisher);
  }

  register(publisher: IEventPublisher): void | never {
    if (this.publishers.has(publisher)) {
      throw new Error(`${publisher.constructor.name} already registered`);
    }

    this.publishers.add(publisher);
  }

  unregister(publisher: IEventPublisher): void | never {
    if (!this.publishers.has(publisher)) {
      throw new Error(`Event publisher ${publisher.constructor.name} is not registered`);
    }

    this.publishers.delete(publisher);
  }
}
