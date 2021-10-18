import { EMPTY, of, Unsubscribable } from 'rxjs';
import { catchError, filter, map, mergeMap, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { CommandBus } from '../command/command-bus';
import { CommandRepository } from '../command/command-repository';
import { EventBus } from './event-bus';
import { IEventHandler } from './event-handler';
import { EventHandlerRegistry } from './event-handler-registry';
import { EventRepository } from './event-repository';

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
  ) {}

  /**
   * Registers a given event handler in {@link EventHandlerRegistry} to ensure sagas are unique.
   * Subscribes a given event handler to {@link EventBus} to respond to corresponding events and publishes resolved commands to {@link CommandBus}.
   */
  register(handler: IEventHandler): Unsubscribable {
    this.registry.register(handler);

    const subscription = this.eventBus.events$
      .pipe(
        filter((event) => event instanceof handler.handles),
        mergeMap((event) => {
          return handler.handle(of(event)).pipe(
            catchError((error) => {
              console.error(event, 'handler failed with', error);
              return EMPTY;
            }),
            map((command) =>
              this.commandRepository.persist(command, {
                sourceEventId: this.eventRepository.getId(event),
              }),
            ),
            tap((command) => this.commandBus.execute(command)),
          );
        }),
      )
      .subscribe();

    subscription.add(() => {
      this.registry.unregister(handler);
    });

    return subscription;
  }
}
