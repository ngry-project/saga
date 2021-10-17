import 'reflect-metadata';
import { Type } from '@angular/core';
import { IEvent } from '../event/event';

const SAGA_METADATA = Symbol();

/**
 * @internal
 */
export class SagaMetadata {
  private readonly _eventListeners = new Map<PropertyKey, Type<IEvent>>();
  private readonly _eventPublishers = new Set<PropertyKey>();

  get eventListeners(): ReadonlyMap<PropertyKey, Type<IEvent>> {
    return this._eventListeners;
  }

  get eventPublishers(): ReadonlySet<PropertyKey> {
    return this._eventPublishers;
  }

  static of(target: object): SagaMetadata {
    let metadata: SagaMetadata | undefined = Reflect.getMetadata(SAGA_METADATA, target);

    if (!metadata) {
      metadata = new SagaMetadata();

      Reflect.defineMetadata(SAGA_METADATA, metadata, target);
    }

    return metadata;
  }

  addEventListener(methodKey: PropertyKey, listensTo: Type<IEvent>) {
    this._eventListeners.set(methodKey, listensTo);
  }

  addEventPublisher(propertyKey: PropertyKey) {
    this._eventPublishers.add(propertyKey);
  }
}
