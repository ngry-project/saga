import { EMPTY, Observable, of } from 'rxjs';
import { catchError, filter, mergeMap, tap } from 'rxjs/operators';
import { Inject, Injectable, Optional } from '@angular/core';
import { SAGA_ROOT_OPTIONS, SagaRootOptions } from '../configuration/saga-root-options';
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
    @Inject(SAGA_ROOT_OPTIONS)
    @Optional()
    private readonly options?: SagaRootOptions,
  ) {}

  /**
   * Registers given command handler in {@link CommandHandlerRegistry} to ensure command of specific type has only one handler.
   * Subscribes given command handler to {@link CommandBus} to execute published commands of specific type.
   */
  register(handler: ICommandHandler): void {
    if (this.options?.debug) {
      console.log(new Date().toISOString(), handler);
    }

    this.registry.register(handler);

    this.commandBus.commands$
      .pipe(
        filter((command) => command instanceof handler.executes),
        mergeMap((command) =>
          handler.execute(of(command)).pipe(
            catchError((error) => {
              console.error(command, 'execution failed with', error);
              return EMPTY;
            }),
            tap((event) => {
              this.eventRepository.persist(event, {
                sourceCommandId: this.commandRepository.getId(command),
              });
              this.eventBus.publish(event);
            }),
          ),
        ),
      )
      .subscribe();
  }

  scan(saga: object): void {
    const metadata = SagaMetadata.of(saga.constructor.prototype);

    if (metadata) {
      for (const [methodKey, executes] of metadata.commandHandlers) {
        this.register({
          executes,
          execute(command$: Observable<ICommand>): Observable<IEvent> {
            return (saga as any)[methodKey](command$);
          },
        });
      }
    }
  }
}
