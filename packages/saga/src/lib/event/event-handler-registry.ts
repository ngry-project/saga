import { Inject, Injectable, Optional } from '@angular/core';
import { IEventHandler } from './event-handler';
import { SAGA_ROOT_OPTIONS, SagaRootOptions } from '../configuration/saga-root-options';

/**
 * Represents an event handler registry.
 * Ensures event handlers are unique.
 * @internal
 */
@Injectable({
  providedIn: 'root',
})
export class EventHandlerRegistry {
  private readonly handlers = new Set<IEventHandler>();

  constructor(
    @Inject(SAGA_ROOT_OPTIONS)
    @Optional()
    private readonly options?: SagaRootOptions,
  ) {}

  /**
   * Registers a unique event handler.
   * @param handler Event handler to register.
   * @throws {Error} If event handler is not unique.
   */
  register(handler: IEventHandler): void | never {
    if (this.handlers.has(handler)) {
      throw new Error(`${handler.constructor.name} already registered`);
    }

    this.handlers.add(handler);
  }
}
