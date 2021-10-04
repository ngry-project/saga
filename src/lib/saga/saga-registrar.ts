import { EMPTY, of } from 'rxjs';
import { catchError, mergeMap, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ofType } from '@ngry/rx';
import { CommandBus } from '../command/command-bus';
import { EventBus } from '../event/event-bus';
import { ISaga } from './saga';
import { SagaRegistry } from './saga-registry';

/**
 * Represents saga registrar.
 * Registers sagas in {@link SagaRegistry} to ensure sagas are unique.
 * Subscribes sagas to {@link EventBus} to respond to corresponding events and publishes resolved commands to {@link CommandBus}.
 * @internal
 */
@Injectable({
  providedIn: 'root',
})
export class SagaRegistrar {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus,
    private readonly registry: SagaRegistry,
  ) {
  }

  /**
   * Registers given saga in {@link SagaRegistry} to ensure sagas are unique.
   * Subscribes given saga to {@link EventBus} to respond to corresponding events and publishes resolved commands to {@link CommandBus}.
   */
  register(saga: ISaga): void {
    this.registry.register(saga);

    this.eventBus.events$.pipe(
      ofType(saga.handles),
      mergeMap(event => {
        return saga.handle(of(event)).pipe(
          catchError(error => {
            console.error(error);
            return EMPTY;
          }),
          tap(command => this.commandBus.execute(command)),
        );
      }),
    ).subscribe();
  }
}
