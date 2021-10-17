import { Unsubscribable } from 'rxjs';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { IEvent } from './event';
import { EventBus } from './event-bus';
import { EventListener } from './event-listener.decorator';
import { EventListenerRegistry } from './event-listener-registry';
import { EventListenerScanner } from './event-listener-scanner';

class TestEvent implements IEvent {
  constructor(readonly payload: string) {}
}

@Injectable({
  providedIn: 'root',
})
class TestSaga {
  @EventListener(TestEvent)
  onTest(event: TestEvent) {
    return event;
  }
}

describe('EventListenerScanner', () => {
  let scanner: EventListenerScanner;
  let registry: EventListenerRegistry;
  let eventBus: EventBus;
  let saga: TestSaga;

  beforeEach(() => {
    scanner = TestBed.inject(EventListenerScanner);
    registry = TestBed.inject(EventListenerRegistry);
    eventBus = TestBed.inject(EventBus);
    saga = TestBed.inject(TestSaga);
  });

  describe('#scan', () => {
    let subscription: Unsubscribable;

    beforeEach(() => {
      subscription = scanner.scan(saga);
    });

    it('should register the listener(s) in the registry', () => {
      expect(registry.length).toBe(1);
    });

    it('should bind the listener(s) to the event bus', async () => {
      jest.spyOn(saga, 'onTest');

      const event = new TestEvent('hello');

      await eventBus.publish(event);

      expect(saga.onTest).toHaveBeenCalledTimes(1);
      expect(saga.onTest).toHaveBeenLastCalledWith(event);
    });

    describe('subscription', () => {
      beforeEach(() => {
        subscription.unsubscribe();
      });

      it('should unregister the listener(s) from the registry', () => {
        expect(registry.length).toBe(0);
      });

      it('should unbind the listener(s) from the event bus', async () => {
        jest.spyOn(saga, 'onTest');

        const event = new TestEvent('hello');

        await eventBus.publish(event);

        expect(saga.onTest).toHaveBeenCalledTimes(0);
      });
    });
  });
});
