import { Inject, Injector, NgModule } from '@angular/core';
import { CommandHandlerRegistrar } from '../command/command-handler-registrar';
import { SagaRegistrar } from '../saga/saga-registrar';
import { SAGA_FEATURE_OPTIONS, SagaFeatureOptions } from './saga-feature-options';

@NgModule()
export class SagaFeatureModule {
  constructor(
    @Inject(SAGA_FEATURE_OPTIONS) features: Array<SagaFeatureOptions>,
    injector: Injector,
    commandHandlerRegistrar: CommandHandlerRegistrar,
    sagaRegistrar: SagaRegistrar
  ) {
    for (const feature of features) {
      const {commands = [], sagas = []} = feature;

      for (const type of commands) {
        commandHandlerRegistrar.register(injector.get(type));
      }

      for (const type of sagas) {
        sagaRegistrar.register(injector.get(type));
      }
    }
  }
}
