import { InjectionToken, Type } from '@angular/core';
import { ICommandHandler } from '../command/command-handler';
import { ISaga } from '../saga/saga';

export interface SagaFeatureOptions {
  commands?: Array<Type<ICommandHandler>>;
  sagas?: Array<Type<ISaga>>;
}

export const SAGA_FEATURE_OPTIONS = new InjectionToken<SagaFeatureOptions>('SagaFeatureOptions');
