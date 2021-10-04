import { Injectable } from '@angular/core';
import { ISaga } from './saga';

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

  /**
   * Registers a unique saga.
   * @param saga Saga to register.
   * @throws {Error} If saga is not unique.
   */
  register(saga: ISaga): void | never {
    if (this.sagas.has(saga)) {
      throw new Error(`${saga.constructor.name} already registered`);
    }

    this.sagas.add(saga);
  }
}
