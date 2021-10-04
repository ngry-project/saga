import {Inject, Injectable, Optional} from '@angular/core';
import {ISaga} from './saga';
import {SAGA_ROOT_OPTIONS, SagaRootOptions} from '../configuration/saga-root-options';

/**
 * Represents a saga registry.
 * Ensures sagas are unique.
 * @internal
 */
@Injectable({
  providedIn: 'root',
})
export class SagaRegistry {
  private readonly sagas = new Set<ISaga>();

  constructor(
    @Inject(SAGA_ROOT_OPTIONS) @Optional()
    private readonly options?: SagaRootOptions,
  ) {
  }

  /**
   * Registers a unique saga.
   * @param saga Saga to register.
   * @throws {Error} If saga is not unique.
   */
  register(saga: ISaga): void | never {
    if (this.options?.debug) {
      console.log(new Date().toISOString(), saga)
    }

    if (this.sagas.has(saga)) {
      throw new Error(`${saga.constructor.name} already registered`);
    }

    this.sagas.add(saga);
  }
}
