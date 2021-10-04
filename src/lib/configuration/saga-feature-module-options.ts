import { InjectionToken, Type } from '@angular/core';
import { ICommandHandler } from '../command/command-handler';
import { ISaga } from '../saga/saga';

export interface SagaFeatureModuleOptions {
  commands?: Array<Type<ICommandHandler>>;
  sagas?: Array<Type<ISaga>>;
}

export const SAGA_FEATURE_MODULE_OPTIONS = new InjectionToken<SagaFeatureModuleOptions>('SagaFeatureModuleOptions');
