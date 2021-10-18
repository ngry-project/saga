import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { IEvent } from './event';
import { IEventPublisher } from './event-publisher';
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

describe('EventPublisherRegistry', () => {
  let registry: EventPublisherRegistry;
  let publisher: TestEventPublisher;

  beforeEach(() => {
    registry = TestBed.inject(EventPublisherRegistry);
    publisher = TestBed.inject(TestEventPublisher);
  });

  describe('#register', () => {
    beforeEach(() => {
      registry.register(publisher);
    });

    it('should store event publisher', () => {
      expect(registry.length).toBe(1);
      expect(registry.has(publisher)).toBe(true);
    });

    describe('when the given event publisher already registered', () => {
      it('should throw an error', () => {
        expect(() => {
          registry.register(publisher);
        }).toThrow('TestEventPublisher already registered');
      });
    });
  });

  describe('#unregister', () => {
    beforeEach(() => {
      registry.register(publisher);
    });

    beforeEach(() => {
      registry.unregister(publisher);
    });

    it('should delete the publisher from the registry', () => {
      expect(registry.length).toBe(0);
    });

    describe('when the given event publisher is not registered', () => {
      it('should throw an error', () => {
        expect(() => {
          registry.unregister(publisher);
        }).toThrow('Event publisher TestEventPublisher is not registered');
      });
    });
  });
});
