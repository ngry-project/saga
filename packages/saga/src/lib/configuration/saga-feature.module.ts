import { Inject, Injector, NgModule } from '@angular/core';
import { CommandHandlerRegistrar } from '../command/command-handler-registrar';
import { EventHandlerRegistrar } from '../event/event-handler-registrar';
import { SAGA_FEATURE_OPTIONS, SagaFeatureOptions } from './saga-feature-options';

@NgModule()
export class SagaFeatureModule {
  constructor(
    @Inject(SAGA_FEATURE_OPTIONS) features: Array<SagaFeatureOptions>,
    injector: Injector,
    commandHandlerRegistrar: CommandHandlerRegistrar,
    eventHandlerRegistrar: EventHandlerRegistrar,
  ) {
    for (const feature of features) {
      const { commands = [], events = [], sagas = [] } = feature;

      for (const type of commands) {
        commandHandlerRegistrar.register(injector.get(type));
      }

      for (const type of events) {
        eventHandlerRegistrar.register(injector.get(type));
      }

      for (const type of sagas) {
        commandHandlerRegistrar.scan(injector.get(type));
        eventHandlerRegistrar.scan(injector.get(type));
      }
    }
  }
}
