import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { IEvent } from './event';
import { EventBus } from './event-bus';
import { EventPublisher } from './event-publisher.decorator';
import { EventPublisherRegistry } from './event-publisher-registry';
import { EventPublisherScanner } from './event-publisher-scanner';

class TestEvent implements IEvent {
  constructor(readonly payload: string) {}
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

describe('EventPublisherScanner', () => {
  let eventBus: EventBus;
  let scanner: EventPublisherScanner;
  let registry: EventPublisherRegistry;
  let saga: TestSaga;

  beforeEach(() => {
    eventBus = TestBed.inject(EventBus);
    scanner = TestBed.inject(EventPublisherScanner);
    registry = TestBed.inject(EventPublisherRegistry);
    saga = TestBed.inject(TestSaga);
  });

  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('#scan', () => {
    describe('when the object has properties decorated with @EventPublisher decorator', () => {
      beforeEach(() => {
        scanner.scan(saga);
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
        scanner.scan({});
      });

      it('should not add any publishers to the registry', () => {
        expect(registry.length).toBe(0);
      });
    });
  });
});
