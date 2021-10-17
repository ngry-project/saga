import { Unsubscribable } from 'rxjs';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { IEvent } from './event';
import { EventBus } from './event-bus';
import { IEventListener } from './event-listener';
import { EventListener } from './event-listener.decorator';
import { EventListenerRegistrar } from './event-listener-registrar';
import { EventListenerRegistry } from './event-listener-registry';

class TestEvent implements IEvent {
  constructor(readonly payload: string) {}
}

@Injectable({
  providedIn: 'root',
})
class TestListener implements IEventListener<TestEvent> {
  readonly listensTo = TestEvent;

  on(event: TestEvent) {
    return event;
  }
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

describe('EventListenerRegistrar', () => {
  let registrar: EventListenerRegistrar;
  let registry: EventListenerRegistry;
  let eventBus: EventBus;
  let listener: TestListener;
  let saga: TestSaga;

  beforeEach(() => {
    registrar = TestBed.inject(EventListenerRegistrar);
    registry = TestBed.inject(EventListenerRegistry);
    eventBus = TestBed.inject(EventBus);
    listener = TestBed.inject(TestListener);
    saga = TestBed.inject(TestSaga);
  });

  describe('#register', () => {
    let subscription: Unsubscribable;

    beforeEach(() => {
      subscription = registrar.register(listener);
    });

    it('should register the listener in the registry', () => {
      expect(registry.has(listener)).toBe(true);
    });

    it('should bind the listener to the event bus', async () => {
      jest.spyOn(listener, 'on');

      const event = new TestEvent('hello');

      await eventBus.publish(event);

      expect(listener.on).toHaveBeenCalledTimes(1);
      expect(listener.on).toHaveBeenLastCalledWith(event);
    });

    describe('subscription', () => {
      beforeEach(() => {
        subscription.unsubscribe();
      });

      it('should unregister the listener from the registry', () => {
        expect(registry.has(listener)).toBe(false);
      });

      it('should unbind the listener from the event bus', async () => {
        jest.spyOn(listener, 'on');

        const event = new TestEvent('hello');

        await eventBus.publish(event);

        expect(listener.on).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('#scan', () => {
    let subscription: Unsubscribable;

    beforeEach(() => {
      subscription = registrar.scan(saga);
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
