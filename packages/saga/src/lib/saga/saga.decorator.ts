import 'reflect-metadata';
import { Type } from '@angular/core';
import { IEvent } from '../event/event';

export const SAGA_METADATA = Symbol();

export interface SagaDefinition {
  readonly handles: Type<IEvent>;
}

export class SagaMetadata {
  readonly definitions = new Map<PropertyKey, SagaDefinition>();
}

export function Saga(handles: Type<IEvent>): MethodDecorator {
  return (target, propertyKey) => {
    let metadata: SagaMetadata | undefined = Reflect.getMetadata(SAGA_METADATA, target);

    if (!metadata) {
      metadata = new SagaMetadata();

      Reflect.defineMetadata(SAGA_METADATA, metadata, target);
    }

    metadata.definitions.set(propertyKey, {
      handles,
    });
  };
}
