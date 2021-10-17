import { Type } from '@angular/core';
import { IEvent } from './event';
import { EventListenerMetadata } from './event-listener-metadata';

export function EventListener<TEvent extends IEvent>(listensTo: Type<TEvent>): MethodDecorator {
  return (target, methodKey) => {
    EventListenerMetadata.of(target).set(methodKey, listensTo);
  };
}
