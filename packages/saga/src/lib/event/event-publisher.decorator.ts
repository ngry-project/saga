import { EventPublisherMetadata } from './event-publisher-metadata';

/**
 * Marks property as an event publisher.
 * This property holds an `Observable<IEvent>`, events of which will be forwarded to {@link EventBus} implicitly.
 *
 * @example
 *
 * ```ts
 * @EventPublisher()
 * get customerUpdate$(): Observable<CustomerUpdateEvent> {
 *   return this.socket.pipe(
 *     filter(...),
 *     map(customer => new CustomerUpdateEvent(customer));
 *   );
 * }
 * ```
 */
export function EventPublisher(): PropertyDecorator {
  return (target, propertyKey) => {
    EventPublisherMetadata.of(target).add(propertyKey);
  };
}
