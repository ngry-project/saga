import 'reflect-metadata';

const SAGA_METADATA = Symbol();

/**
 * @internal
 */
export class SagaMetadata {
  private readonly _eventPublishers = new Set<PropertyKey>();

  get eventPublishers(): ReadonlySet<PropertyKey> {
    return this._eventPublishers;
  }

  static of(target: object): SagaMetadata {
    let metadata: SagaMetadata | undefined = Reflect.getMetadata(SAGA_METADATA, target);

    if (!metadata) {
      metadata = new SagaMetadata();

      Reflect.defineMetadata(SAGA_METADATA, metadata, target);
    }

    return metadata;
  }

  addEventPublisher(propertyKey: PropertyKey) {
    this._eventPublishers.add(propertyKey);
  }
}
