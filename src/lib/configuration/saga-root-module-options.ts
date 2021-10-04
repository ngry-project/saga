import { InjectionToken } from '@angular/core';

export interface SagaRootModuleOptions {
  debug?: boolean;
}

export const SAGA_ROOT_MODULE_OPTIONS = new InjectionToken<SagaRootModuleOptions>('SagaRootModuleOptions');
