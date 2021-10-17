import 'reflect-metadata';
import { Type } from '@angular/core';
import { IEvent } from './event';

const EVENT_HANDLER_METADATA = Symbol();

/**
 * @internal
 */
export class EventHandlerMetadata {
  private readonly _handlers = new Map<PropertyKey, Type<IEvent>>();

  get handlers(): ReadonlyMap<PropertyKey, Type<IEvent>> {
    return this._handlers;
  }

  static of(target: object): EventHandlerMetadata {
    let metadata: EventHandlerMetadata | undefined = Reflect.getMetadata(EVENT_HANDLER_METADATA, target);

    if (!metadata) {
      metadata = new EventHandlerMetadata();

      Reflect.defineMetadata(EVENT_HANDLER_METADATA, metadata, target);
    }

    return metadata;
  }

  set(methodKey: PropertyKey, handles: Type<IEvent>) {
    this._handlers.set(methodKey, handles);
  }
}
