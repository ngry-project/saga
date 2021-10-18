import { Inject, Injector, NgModule } from '@angular/core';
import { CommandHandlerRegistrar } from '../command/command-handler-registrar';
import { CommandHandlerScanner } from '../command/command-handler-scanner';
import { EventHandlerRegistrar } from '../event/event-handler-registrar';
import { EventHandlerScanner } from '../event/event-handler-scanner';
import { EventPublisherRegistrar } from '../event/event-publisher-registrar';
import { EventListenerRegistrar } from '../event/event-listener-registrar';
import { EventListenerScanner } from '../event/event-listener-scanner';
import { EventPublisherScanner } from '../event/event-publisher-scanner';
import { SAGA_FEATURE_OPTIONS, SagaFeatureOptions } from './saga-feature-options';

@NgModule()
export class SagaFeatureModule {
  constructor(
    @Inject(SAGA_FEATURE_OPTIONS) features: Array<SagaFeatureOptions>,
    injector: Injector,
    commandHandlerRegistrar: CommandHandlerRegistrar,
    commandHandlerScanner: CommandHandlerScanner,
    eventHandlerRegistrar: EventHandlerRegistrar,
    eventHandlerScanner: EventHandlerScanner,
    eventListenerRegistrar: EventListenerRegistrar,
    eventListenerScanner: EventListenerScanner,
    eventPublisherRegistrar: EventPublisherRegistrar,
    eventPublisherScanner: EventPublisherScanner,
  ) {
    for (const feature of features) {
      const { commands = [], events = [], publishers = [], listeners = [], sagas = [] } = feature;

      for (const type of commands) {
        commandHandlerRegistrar.register(injector.get(type));
      }

      for (const type of events) {
        eventHandlerRegistrar.register(injector.get(type));
      }

      for (const type of listeners) {
        eventListenerRegistrar.register(injector.get(type));
      }

      for (const type of sagas) {
        commandHandlerScanner.scan(injector.get(type));
        eventHandlerScanner.scan(injector.get(type));
        eventListenerScanner.scan(injector.get(type));
      }

      for (const type of publishers) {
        eventPublisherRegistrar.register(injector.get(type));
      }

      for (const type of sagas) {
        eventPublisherScanner.scan(injector.get(type));
      }
    }
  }
}
