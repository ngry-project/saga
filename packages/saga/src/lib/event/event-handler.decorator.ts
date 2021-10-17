import { Type } from '@angular/core';
import { IEvent } from './event';
import { EventHandlerMetadata } from './event-handler-metadata';

/**
 * Marks method as the event handler.
 * This method will be invoked to handle a single event of given type emitted by {@link EventBus}.
 * Method receives a stream that emits a single event, then completes.
 * Method returns a stream of commands.
 *
 * @example
 *
 * ```ts
 * @EventHandler(PaymentInitEvent)
 * onPaymentInit(event$: Observable<PaymentInitEvent>): Observable<ICommand> {
 *   return event$.pipe(
 *     ...
 *     map(event => new MakePaymentCommand(event.minAmount));
 *   );
 * }
 * ```
 */
export function EventHandler(handles: Type<IEvent>): MethodDecorator {
  return (target, methodKey) => {
    EventHandlerMetadata.of(target).set(methodKey, handles);
  };
}
