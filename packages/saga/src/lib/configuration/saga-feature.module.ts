import { Inject, Injector, NgModule } from '@angular/core';
import { CommandHandlerRegistrar } from '../command/command-handler-registrar';
import { CommandHandlerScanner } from '../command/command-handler-scanner';
import { EventHandlerRegistrar } from '../event/event-handler-registrar';
import { EventPublisherRegistrar } from '../event/event-publisher-registrar';
import { SAGA_FEATURE_OPTIONS, SagaFeatureOptions } from './saga-feature-options';
import { EventListenerRegistrar } from '../event/event-listener-registrar';

@NgModule()
export class SagaFeatureModule {
  constructor(
    @Inject(SAGA_FEATURE_OPTIONS) features: Array<SagaFeatureOptions>,
    injector: Injector,
    commandHandlerRegistrar: CommandHandlerRegistrar,
    commandHandlerScanner: CommandHandlerScanner,
    eventHandlerRegistrar: EventHandlerRegistrar,
    eventPublisherRegistrar: EventPublisherRegistrar,
    eventListenerRegistrar: EventListenerRegistrar,
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
        eventHandlerRegistrar.scan(injector.get(type));
        eventListenerRegistrar.scan(injector.get(type));
      }

      for (const type of publishers) {
        eventPublisherRegistrar.register(injector.get(type));
      }

      for (const type of sagas) {
        eventPublisherRegistrar.scan(injector.get(type));
      }
    }
  }
}
