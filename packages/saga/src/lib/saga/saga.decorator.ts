import 'reflect-metadata';
import { Type } from '@angular/core';
import { IEvent } from '../event/event';

export const SAGA_METADATA = Symbol();

export interface SagaDefinition {
  readonly handles: Type<IEvent>;
  readonly within?: Type<object>;
}

export class SagaMetadata {
  readonly definitions = new Map<PropertyKey, SagaDefinition>();
}

export interface SagaOptions {
  readonly within?: Type<object>;
}

export function Saga(handles: Type<IEvent>, options?: SagaOptions): MethodDecorator {
  return (target, propertyKey) => {
    let metadata: SagaMetadata | undefined = Reflect.getMetadata(SAGA_METADATA, target);

    if (!metadata) {
      metadata = new SagaMetadata();

      Reflect.defineMetadata(SAGA_METADATA, metadata, target);
    }

    metadata.definitions.set(propertyKey, {
      handles,
      within: options?.within,
    });
  };
}
