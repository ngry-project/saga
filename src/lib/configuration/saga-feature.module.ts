import { Inject, Injector, NgModule } from '@angular/core';
import { CommandHandlerRegistrar } from '../command/command-handler-registrar';
import { SagaRegistrar } from '../saga/saga-registrar';
import { SAGA_FEATURE_MODULE_OPTIONS, SagaFeatureModuleOptions } from './saga-feature-module-options';

@NgModule()
export class SagaFeatureModule {
  constructor(
    @Inject(SAGA_FEATURE_MODULE_OPTIONS) features: Array<SagaFeatureModuleOptions>,
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
