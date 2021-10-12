import { Injectable } from '@angular/core';
import { CommandHandlerRegistrar } from '../command/command-handler-registrar';
import { EventHandlerRegistrar } from '../event/event-handler-registrar';
import { EventPublisherRegistrar } from '../event/event-publisher-registrar';
import { SagaRef } from './saga-ref';

@Injectable({
  providedIn: 'root',
})
export class SagaRegistry {
  constructor(
    private readonly commandHandlerRegistrar: CommandHandlerRegistrar,
    private readonly eventHandlerRegistrar: EventHandlerRegistrar,
    private readonly eventPublisherRegistrar: EventPublisherRegistrar,
  ) {}

  register(saga: object): SagaRef {
    return new SagaRef(
      this.commandHandlerRegistrar.scan(saga),
      this.eventHandlerRegistrar.scan(saga),
      this.eventPublisherRegistrar.scan(saga),
    );
  }
}
