import 'reflect-metadata';
import { Type } from '@angular/core';
import { IEvent } from './event';

const EVENT_LISTENER_METADATA = Symbol();

/**
 * @internal
 */
export class EventListenerMetadata {
  private readonly _listeners = new Map<PropertyKey, Type<IEvent>>();

  get listeners(): ReadonlyMap<PropertyKey, Type<IEvent>> {
    return this._listeners;
  }

  static of(target: object): EventListenerMetadata {
    let metadata: EventListenerMetadata | undefined = Reflect.getMetadata(EVENT_LISTENER_METADATA, target);

    if (!metadata) {
      metadata = new EventListenerMetadata();

      Reflect.defineMetadata(EVENT_LISTENER_METADATA, metadata, target);
    }

    return metadata;
  }

  set(methodKey: PropertyKey, listensTo: Type<IEvent>) {
    this._listeners.set(methodKey, listensTo);
  }
}
