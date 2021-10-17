import { EMPTY, of, Unsubscribable } from 'rxjs';
import { catchError, filter, map, mergeMap, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { EventBus } from '../event/event-bus';
import { EventRepository } from '../event/event-repository';
import { CommandBus } from './command-bus';
import { ICommandHandler } from './command-handler';
import { CommandHandlerRegistry } from './command-handler-registry';
import { CommandRepository } from './command-repository';

/**
 * Represents a command handler registrar.
 * Registers command handlers in {@link CommandHandlerRegistry} to ensure command of specific type has only one handler.
 * Binds command handlers to {@link CommandBus} to execute published commands of specific type.
 * @internal
 */
@Injectable({
  providedIn: 'root',
})
export class CommandHandlerRegistrar {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus,
    private readonly registry: CommandHandlerRegistry,
    private readonly commandRepository: CommandRepository,
    private readonly eventRepository: EventRepository,
  ) {}

  /**
   * Registers a given command handler in the {@link CommandHandlerRegistry} to ensure a command of specific type has only one handler.
   * Binds a given command handler to the {@link CommandBus} to execute published commands of specific type.
   * @param handler A command handler to register in the {@link CommandHandlerRegistry} and bind to the {@link CommandBus}.
   * @returns {Unsubscribable} A subscription object used to cancel the binding to the {@link CommandBus} and unregister the handler from the {@link CommandHandlerRegistry}.
   */
  register(handler: ICommandHandler): Unsubscribable {
    this.registry.register(handler);

    const subscription = this.commandBus.commands$
      .pipe(
        filter((command) => command instanceof handler.executes),
        mergeMap((command) =>
          handler.execute(of(command)).pipe(
            catchError((error) => {
              console.error(command, 'execution failed with', error);
              return EMPTY;
            }),
            map((event) =>
              this.eventRepository.persist(event, {
                sourceCommandId: this.commandRepository.getId(command),
              }),
            ),
            tap((event) => this.eventBus.publish(event)),
          ),
        ),
      )
      .subscribe();

    subscription.add(() => {
      this.registry.unregister(handler);
    });

    return subscription;
  }
}
