import { Injectable } from '@angular/core';
import { IEvent } from './event';
import { IEventHandler } from './event-handler';

/**
 * Represents an event handler registry.
 * Ensures event handlers are unique.
 * @internal
 */
@Injectable({
  providedIn: 'root',
})
export class EventHandlerRegistry {
  private readonly handlers = new Set<IEventHandler>();

  get length(): number {
    return this.handlers.size;
  }

  has(handler: IEventHandler): boolean {
    return this.handlers.has(handler);
  }

  /**
   * Returns a list of event handlers able to handle the given event.
   * @param event An event to find handlers for.
   */
  resolve(event: IEvent): ReadonlyArray<IEventHandler> {
    const matches: Array<IEventHandler> = [];

    for (const handler of this.handlers) {
      if (event instanceof handler.handles) {
        matches.push(handler);
      }
    }

    return matches;
  }

  /**
   * Registers a unique event handler.
   * Specific event type may be handled by multiple handlers, but these handlers must be unique.
   * @param handler Event handler to register.
   * @throws {Error} If event handler is not unique.
   */
  register(handler: IEventHandler): void | never {
    if (this.handlers.has(handler)) {
      throw new Error(`Such handler of ${handler.handles.name} is already registered`);
    }

    this.handlers.add(handler);
  }

  unregister(handler: IEventHandler): void | never {
    if (!this.handlers.has(handler)) {
      throw new Error(`Event handler of ${handler.handles.name} is not registered`);
    }

    this.handlers.delete(handler);
  }
}
