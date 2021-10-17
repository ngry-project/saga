import { Type } from '@angular/core';
import { IEvent } from './event';
import { SagaMetadata } from '../saga/saga-metadata';

export function EventListener<TEvent extends IEvent>(listensTo: Type<TEvent>): MethodDecorator {
  return (target, methodKey) => {
    SagaMetadata.of(target).addEventListener(methodKey, listensTo);
  };
}
