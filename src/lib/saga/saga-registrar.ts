import { EMPTY, Observable, of } from 'rxjs';
import { catchError, filter, mergeMap, tap } from 'rxjs/operators';
import { Inject, Injectable, Optional } from '@angular/core';
import { ofType } from '@ngry/rx';
import { ICommand } from '../command/command';
import { CommandBus } from '../command/command-bus';
import { SAGA_ROOT_OPTIONS, SagaRootOptions } from '../configuration/saga-root-options';
import { IEvent } from '../event/event';
import { EventBus } from '../event/event-bus';
import { ISaga } from './saga';
import { SAGA_METADATA, SagaMetadata } from './saga.decorator';
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
    @Inject(SAGA_ROOT_OPTIONS) @Optional()
    private readonly options?: SagaRootOptions,
  ) {
  }

  /**
   * Registers given saga in {@link SagaRegistry} to ensure sagas are unique.
   * Subscribes given saga to {@link EventBus} to respond to corresponding events and publishes resolved commands to {@link CommandBus}.
   */
  register(saga: ISaga): void {
    if (this.options?.debug) {
      console.log(new Date().toISOString(), saga);
    }

    this.registry.register(saga);

    this.eventBus.events$.pipe(
      ofType(saga.handles),
      filter(event => saga.within == null || event.context instanceof saga.within),
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

  scan(flow: object): void {
    const metadata: SagaMetadata | undefined = Reflect.getMetadata(SAGA_METADATA, flow.constructor.prototype);

    if (metadata) {
      for (const [methodKey, definition] of metadata.definitions) {
        this.register({
          handles: definition.handles,
          within: definition.within,
          handle(event$: Observable<IEvent>): Observable<ICommand> {
            return (flow as any)[methodKey](event$);
          },
        });
      }
    }
  }
}
