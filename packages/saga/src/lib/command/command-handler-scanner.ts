import { Observable, Subscription, Unsubscribable } from 'rxjs';
import { Injectable } from '@angular/core';
import { IEvent } from '../event/event';
import { ICommand } from './command';
import { CommandHandlerMetadata } from './command-handler-metadata';
import { CommandHandlerRegistrar } from './command-handler-registrar';

/**
 * Represents command handler scanner.
 * Scans class for {@link CommandHandlerMetadata} and dynamically registers new command handlers.
 * @internal
 */
@Injectable({
  providedIn: 'root',
})
export class CommandHandlerScanner {
  constructor(private readonly registrar: CommandHandlerRegistrar) {}

  /**
   * Scans source object's prototype for {@link CommandHandlerMetadata} and
   * registers dynamically created {@link ICommandHandler}s in the {@link CommandHandlerRegistry}.
   * @param source Source object to scan for {@link CommandHandlerMetadata}
   * @returns {Unsubscribable} A subscription object used to cancel the binding(s) to the {@link CommandBus} and
   * unregister dynamically create {@link ICommandHandler}(s) from the {@link CommandHandlerRegistry}.
   */
  scan(source: object): Unsubscribable {
    const metadata = CommandHandlerMetadata.of(source.constructor.prototype);
    const subscription = new Subscription();

    for (const [methodKey, executes] of metadata.handlers) {
      subscription.add(
        this.registrar.register({
          executes,
          execute(command$: Observable<ICommand>): Observable<IEvent> {
            return (source as any)[methodKey](command$);
          },
        }),
      );
    }

    return subscription;
  }
}
