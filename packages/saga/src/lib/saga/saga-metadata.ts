import 'reflect-metadata';
import { Type } from '@angular/core';
import { ICommand } from '../command/command';
import { IEvent } from '../event/event';

const SAGA_METADATA = Symbol();

/**
 * @internal
 */
export class SagaMetadata {
  private readonly _eventHandlers = new Map<PropertyKey, Type<IEvent>>();
  private readonly _eventPublishers = new Set<PropertyKey>();
  private readonly _commandHandlers = new Map<PropertyKey, Type<ICommand>>();

  get eventHandlers(): ReadonlyMap<PropertyKey, Type<IEvent>> {
    return this._eventHandlers;
  }

  get eventPublishers(): ReadonlySet<PropertyKey> {
    return this._eventPublishers;
  }

  get commandHandlers(): ReadonlyMap<PropertyKey, Type<ICommand>> {
    return this._commandHandlers;
  }

  static of(target: object): SagaMetadata {
    let metadata: SagaMetadata | undefined = Reflect.getMetadata(SAGA_METADATA, target);

    if (!metadata) {
      metadata = new SagaMetadata();

      Reflect.defineMetadata(SAGA_METADATA, metadata, target);
    }

    return metadata;
  }

  addEventHandler(methodKey: PropertyKey, handles: Type<IEvent>) {
    this._eventHandlers.set(methodKey, handles);
  }

  addEventPublisher(propertyKey: PropertyKey) {
    this._eventPublishers.add(propertyKey);
  }

  addCommandHandler(methodKey: PropertyKey, executes: Type<ICommand>) {
    this._commandHandlers.set(methodKey, executes);
  }
}
