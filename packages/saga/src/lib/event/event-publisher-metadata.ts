import 'reflect-metadata';

const EVENT_PUBLISHER_METADATA = Symbol();

/**
 * @internal
 */
export class EventPublisherMetadata {
  private readonly _publishers = new Set<PropertyKey>();

  get publishers(): ReadonlySet<PropertyKey> {
    return this._publishers;
  }

  static of(target: object): EventPublisherMetadata {
    let metadata: EventPublisherMetadata | undefined = Reflect.getMetadata(EVENT_PUBLISHER_METADATA, target);

    if (!metadata) {
      metadata = new EventPublisherMetadata();

      Reflect.defineMetadata(EVENT_PUBLISHER_METADATA, metadata, target);
    }

    return metadata;
  }

  add(propertyKey: PropertyKey) {
    this._publishers.add(propertyKey);
  }
}
