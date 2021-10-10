import { EMPTY, Observable, of } from 'rxjs';
import { catchError, filter, mergeMap } from 'rxjs/operators';
import { Inject, Injectable, Optional } from '@angular/core';
import { SAGA_ROOT_OPTIONS, SagaRootOptions } from '../configuration/saga-root-options';
import { ICommand } from './command';
import { ICommandHandler } from './command-handler';
import { CommandBus } from './command-bus';
import { CommandHandlerRegistry } from './command-handler-registry';
import { COMMAND_HANDLER_METADATA, CommandHandlerMetadata } from './command-handler.decorator';

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
    private readonly registry: CommandHandlerRegistry,
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
              if (handler.rollback) {
                return handler.rollback(of(command), error);
              } else {
                return EMPTY;
              }
            }),
          ),
        ),
      )
      .subscribe();
  }

  scan(flow: object): void {
    const metadata: CommandHandlerMetadata | undefined = Reflect.getMetadata(
      COMMAND_HANDLER_METADATA,
      flow.constructor.prototype,
    );

    if (metadata) {
      for (const [methodKey, executes] of metadata.handlers) {
        this.register({
          executes,
          execute(command$: Observable<ICommand>): Observable<unknown> {
            return (flow as any)[methodKey](command$);
          },
        });
      }
    }
  }
}
