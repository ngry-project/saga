import { Type } from '@angular/core';
import { ICommand } from './command';
import { SagaMetadata } from '../saga/saga-metadata';

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
 */
export function CommandHandler(executes: Type<ICommand>): MethodDecorator {
  return (target, methodKey) => {
    const metadata = SagaMetadata.of(target);

    metadata.addCommandHandler(methodKey, executes);
  };
}
