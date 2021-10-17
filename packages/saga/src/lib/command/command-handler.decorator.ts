import { Type } from '@angular/core';
import { ICommand } from './command';
import { CommandHandlerMetadata } from './command-handler-metadata';

/**
 * Marks method as the command handler.
 * This method will be invoked to execute a single command of given type emitted by {@link CommandBus}.
 * Method receives a stream that emits a single command, then completes.
 * Method returns a stream of events produced during the command execution.
 *
 * @example
 *
 * ```ts
 * @CommandHandler(MakePaymentCommand)
 * makePayment(command$: Observable<MakePaymentCommand>): Observable<IEvent> {
 *   return command$.pipe(
 *     ...
 *     map(command => new PaymentDoneEvent(command.payment));
 *   );
 * }
 * ```
 *
 * @see CommandHandlerMetadata.set
 * @see CommandHandlerRegistrar.scan
 */
export function CommandHandler(executes: Type<ICommand>): MethodDecorator {
  return (target, methodKey) => {
    CommandHandlerMetadata.of(target).set(methodKey, executes);
  };
}
