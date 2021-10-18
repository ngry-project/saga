import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { IEvent } from './event';
import { IEventListener } from './event-listener';
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

describe('EventListenerRegistry', () => {
  let registry: EventListenerRegistry;
  let listener: TestListener;

  beforeEach(() => {
    registry = TestBed.inject(EventListenerRegistry);
    listener = TestBed.inject(TestListener);
  });

  describe('#register', () => {
    beforeEach(() => {
      registry.register(listener);
    });

    it('should add the lister to the registry', () => {
      expect(registry.has(listener)).toBe(true);
    });

    it('should increase size of the registry', () => {
      expect(registry.length).toBe(1);
    });

    describe('when such listener already registered', () => {
      it('should throw an error', () => {
        expect(() => {
          registry.register(listener);
        }).toThrow('Listener of TestEvent already registered');
      });
    });
  });

  describe('#unregister', () => {
    describe('when listener is registered', () => {
      beforeEach(() => {
        registry.register(listener);
      });

      beforeEach(() => {
        registry.unregister(listener);
      });

      it('should remove the listener from the registry', () => {
        expect(registry.has(listener)).toBe(false);
      });

      it('should decrease size of the registry', () => {
        expect(registry.length).toBe(0);
      });
    });

    describe('when listener is not registered', () => {
      it('should throw an error', () => {
        expect(() => {
          registry.unregister(listener);
        }).toThrow('Such event Listener is not registered');
      });
    });
  });
});
