import { Injectable } from '@angular/core';
import { IEventListener } from './event-listener';

@Injectable({
  providedIn: 'root',
})
export class EventListenerRegistry {
  private readonly listeners = new Set<IEventListener>();

  get length(): number {
    return this.listeners.size;
  }

  has(listener: IEventListener): boolean {
    return this.listeners.has(listener);
  }

  register(listener: IEventListener): void | never {
    if (this.listeners.has(listener)) {
      throw new Error(`Listener of ${listener.listensTo.name} already registered`);
    }

    this.listeners.add(listener);
  }

  unregister(listener: IEventListener): void | never {
    if (!this.listeners.has(listener)) {
      throw new Error(`Such event Listener is not registered`);
    }

    this.listeners.delete(listener);
  }
}
