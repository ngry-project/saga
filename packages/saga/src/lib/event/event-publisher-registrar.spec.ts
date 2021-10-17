import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { IEvent } from './event';
import { EventBus } from './event-bus';
import { IEventPublisher } from './event-publisher';
import { EventPublisher } from './event-publisher.decorator';
import { EventPublisherRegistrar } from './event-publisher-registrar';
import { EventPublisherRegistry } from './event-publisher-registry';

class TestEvent implements IEvent {
  constructor(readonly payload: string) {}
}

@Injectable({
  providedIn: 'root',
})
class TestEventPublisher implements IEventPublisher {
  private readonly events$$ = new Subject<IEvent>();

  readonly events$ = this.events$$.asObservable();

  test() {
    this.events$$.next(new TestEvent('hello'));
  }
}

@Injectable({
  providedIn: 'root',
})
class TestSaga {
  @EventPublisher()
  readonly test$ = new Subject<TestEvent>();

  test() {
    this.test$.next(new TestEvent('hello'));
  }
}

describe('EventPublisherRegistrar', () => {
  let eventBus: EventBus;
  let registrar: EventPublisherRegistrar;
  let registry: EventPublisherRegistry;
  let publisher: TestEventPublisher;
  let saga: TestSaga;

  beforeEach(() => {
    eventBus = TestBed.inject(EventBus);
    registrar = TestBed.inject(EventPublisherRegistrar);
    registry = TestBed.inject(EventPublisherRegistry);
    publisher = TestBed.inject(TestEventPublisher);
    saga = TestBed.inject(TestSaga);
  });

  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('#register', () => {
    beforeEach(() => {
      registrar.register(publisher);
    });

    it('should add the publisher to registry', () => {
      expect(registry.has(publisher)).toBe(true);
    });

    it('should forward events from publisher to event bus', async () => {
      jest.spyOn(eventBus, 'publish');

      expect(eventBus.publish).toHaveBeenCalledTimes(0);

      publisher.test();

      expect(eventBus.publish).toHaveBeenCalledTimes(1);
    });
  });

  describe('#scan', () => {
    describe('when the object has properties decorated with @EventPublisher decorator', () => {
      beforeEach(() => {
        registrar.scan(saga);
      });

      it('should add the publisher to registry', () => {
        expect(registry.length).toBe(1);
      });

      it('should forward events from publisher to event bus', async () => {
        jest.spyOn(eventBus, 'publish');

        expect(eventBus.publish).toHaveBeenCalledTimes(0);

        saga.test();

        expect(eventBus.publish).toHaveBeenCalledTimes(1);
      });
    });

    describe('when the object does not have properties decorated with @EventPublisher decorator', () => {
      beforeEach(() => {
        registrar.scan({});
      });

      it('should not add any publishers to the registry', () => {
        expect(registry.length).toBe(0);
      });
    });
  });
});
