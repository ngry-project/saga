import { InjectionToken } from '@angular/core';

export interface SagaRootOptions {
  readonly debug?: boolean;
}

export const SAGA_ROOT_OPTIONS = new InjectionToken<SagaRootOptions>('SagaRootOptions');
