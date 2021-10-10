import { ModuleWithProviders, NgModule } from '@angular/core';
import { SAGA_FEATURE_OPTIONS, SagaFeatureOptions } from './configuration/saga-feature-options';
import { SAGA_ROOT_OPTIONS, SagaRootOptions } from './configuration/saga-root-options';
import { SagaRootModule } from './configuration/saga-root.module';
import { SagaFeatureModule } from './configuration/saga-feature.module';

@NgModule()
export class SagaModule {
  static forRoot(options: SagaRootOptions = {}): ModuleWithProviders<SagaRootModule> {
    return {
      ngModule: SagaRootModule,
      providers: [
        {
          provide: SAGA_ROOT_OPTIONS,
          useValue: options,
        },
      ],
    };
  }

  static forFeature(options: SagaFeatureOptions): ModuleWithProviders<SagaFeatureModule> {
    return {
      ngModule: SagaFeatureModule,
      providers: [
        {
          provide: SAGA_FEATURE_OPTIONS,
          useValue: options,
          multi: true,
        },
      ],
    };
  }
}
