import { EMPTY, Observable, of } from 'rxjs';
import { catchError, filter, mergeMap, tap } from 'rxjs/operators';
import { Inject, Injectable, Optional } from '@angular/core';
import { ICommand } from '../command/command';
import { CommandBus } from '../command/command-bus';
import { CommandRepository } from '../command/command-repository';
import { SAGA_ROOT_OPTIONS, SagaRootOptions } from '../configuration/saga-root-options';
import { IEvent } from './event';
import { EventBus } from './event-bus';
import { IEventHandler } from './event-handler';
import { EventHandlerRegistry } from './event-handler-registry';
import { EventRepository } from './event-repository';
import { SagaMetadata } from '../saga/saga-metadata';

/**
 * Represents an event handler registrar.
 * Registers event handlers in {@link EventHandlerRegistry} to ensure event handler are unique.
 * Subscribes event handlers to {@link EventBus} to respond to corresponding events and publishes resolved commands to {@link CommandBus}.
 * @internal
 */
@Injectable({
  providedIn: 'root',
})
export class EventHandlerRegistrar {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus,
    private readonly registry: EventHandlerRegistry,
    private readonly commandRepository: CommandRepository,
    private readonly eventRepository: EventRepository,
    @Inject(SAGA_ROOT_OPTIONS)
    @Optional()
    private readonly options?: SagaRootOptions,
  ) {}

  /**
   * Registers a given event handler in {@link EventHandlerRegistry} to ensure sagas are unique.
   * Subscribes a given event handler to {@link EventBus} to respond to corresponding events and publishes resolved commands to {@link CommandBus}.
   */
  register(handler: IEventHandler): void {
    if (this.options?.debug) {
      console.log(new Date().toISOString(), handler);
    }

    this.registry.register(handler);

    this.eventBus.events$
      .pipe(
        filter((event) => event instanceof handler.handles),
        mergeMap((event) => {
          return handler.handle(of(event)).pipe(
            catchError((error) => {
              console.error(event, 'handler failed with', error);
              return EMPTY;
            }),
            tap((command) => {
              this.commandRepository.persist(command, {
                sourceEventId: this.eventRepository.getId(event),
              });
              this.commandBus.execute(command);
            }),
          );
        }),
      )
      .subscribe();
  }

  scan(saga: object): void {
    const metadata = SagaMetadata.of(saga.constructor.prototype);

    if (metadata) {
      for (const [methodKey, handles] of metadata.eventHandlers) {
        this.register({
          handles,
          handle(event$: Observable<IEvent>): Observable<ICommand> {
            return (saga as any)[methodKey](event$);
          },
        });
      }
    }
  }
}
