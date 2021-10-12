import 'reflect-metadata';
import { Type } from '@angular/core';
import { IEvent } from '../event/event';
import { ICommand } from '../command/command';

const SAGA_METADATA = Symbol();

/**
 * @internal
 */
export class SagaMetadata {
  private readonly _eventHandlers = new Map<PropertyKey, Type<IEvent>>();
  private readonly _commandHandlers = new Map<PropertyKey, Type<ICommand>>();

  get eventHandlers(): ReadonlyMap<PropertyKey, Type<IEvent>> {
    return this._eventHandlers;
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

  addEventHandler(propertyKey: PropertyKey, handles: Type<IEvent>) {
    this._eventHandlers.set(propertyKey, handles);
  }

  addCommandHandler(propertyKey: PropertyKey, executes: Type<ICommand>) {
    this._commandHandlers.set(propertyKey, executes);
  }
}
