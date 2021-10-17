import { EMPTY, Observable, of, Subscription, Unsubscribable } from 'rxjs';
import { catchError, filter, map, mergeMap, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ICommand } from './command';
import { ICommandHandler } from './command-handler';
import { CommandBus } from './command-bus';
import { CommandHandlerRegistry } from './command-handler-registry';
import { CommandRepository } from './command-repository';
import { IEvent } from '../event/event';
import { EventBus } from '../event/event-bus';
import { EventRepository } from '../event/event-repository';
import { SagaMetadata } from '../saga/saga-metadata';

/**
 * Represents a command handler registrar.
 * Registers command handlers in {@link CommandHandlerRegistry} to ensure command of specific type has only one handler.
 * Subscribes command handlers to {@link CommandBus} to execute published commands of specific type.
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
   * Registers given command handler in {@link CommandHandlerRegistry} to ensure command of specific type has only one handler.
   * Subscribes given command handler to {@link CommandBus} to execute published commands of specific type.
   */
  register(handler: ICommandHandler): Unsubscribable {
    this.registry.register(handler);

    return this.commandBus.commands$
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
  }

  scan(saga: object): Unsubscribable {
    const metadata = SagaMetadata.of(saga.constructor.prototype);
    const subscription = new Subscription();

    for (const [methodKey, executes] of metadata.commandHandlers) {
      subscription.add(
        this.register({
          executes,
          execute(command$: Observable<ICommand>): Observable<IEvent> {
            return (saga as any)[methodKey](command$);
          },
        }),
      );
    }

    return subscription;
  }
}
