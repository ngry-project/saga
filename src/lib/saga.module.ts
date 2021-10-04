import { ModuleWithProviders, NgModule } from '@angular/core';
import { SAGA_FEATURE_MODULE_OPTIONS, SagaFeatureModuleOptions } from './configuration/saga-feature-module-options';
import { SAGA_ROOT_MODULE_OPTIONS, SagaRootModuleOptions } from './configuration/saga-root-module-options';
import { SagaRootModule } from './configuration/saga-root.module';
import { SagaFeatureModule } from './configuration/saga-feature.module';

@NgModule()
export class SagaModule {
  static forRoot(options: SagaRootModuleOptions): ModuleWithProviders<SagaRootModule> {
    return {
      ngModule: SagaRootModule,
      providers: [
        {
          provide: SAGA_ROOT_MODULE_OPTIONS,
          useValue: options,
        },
      ],
    };
  }

  static forFeature(options: SagaFeatureModuleOptions): ModuleWithProviders<SagaFeatureModule> {
    return {
      ngModule: SagaFeatureModule,
      providers: [
        {
          provide: SAGA_FEATURE_MODULE_OPTIONS,
          useValue: options,
          multi: true,
        },
      ],
    };
  }
}
