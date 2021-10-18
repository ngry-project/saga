import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ICommand } from '../command/command';
import { IEvent } from './event';
import { IEventHandler } from './event-handler';
import { EventHandlerRegistry } from './event-handler-registry';

class TestInitEvent implements IEvent {
  constructor(readonly payload: string) {}
}

class TestCommand implements ICommand {
  constructor(readonly payload: string) {}
}

@Injectable({
  providedIn: 'root',
})
class TestHandler implements IEventHandler<TestInitEvent> {
  handles = TestInitEvent;

  handle(event$: Observable<TestInitEvent>): Observable<ICommand> {
    return event$.pipe(map(() => new TestCommand('world')));
  }
}

describe('EventHandlerRegistry', () => {
  let registry: EventHandlerRegistry;
  let handler: TestHandler;

  beforeEach(() => {
    registry = TestBed.inject(EventHandlerRegistry);
    handler = TestBed.inject(TestHandler);
  });

  describe('#register', () => {
    beforeEach(() => {
      registry.register(handler);
    });

    describe('when event type does not have a corresponding handler yet', () => {
      it('should register the event handler', () => {
        expect(registry.resolve(new TestInitEvent('hello'))[0]).toBeInstanceOf(TestHandler);
      });
    });

    describe('when event type already has a corresponding handler', () => {
      it('should throw an error', () => {
        expect(() => {
          registry.register(handler);
        }).toThrow('Such handler of TestInitEvent is already registered');
      });
    });
  });

  describe('#unregister', () => {
    describe('when the event handler is registered', () => {
      beforeEach(() => {
        registry.register(handler);
      });

      it('should remove the event handler from the registry', () => {
        expect(registry.has(handler)).toBe(true);

        registry.unregister(handler);

        expect(registry.has(handler)).toBe(false);
      });
    });

    describe('when the event handler is not registered', () => {
      it('should throw an error', () => {
        expect(() => {
          registry.unregister(handler);
        }).toThrow('Event handler of TestInitEvent is not registered');
      });
    });
  });

  describe('#resolve', () => {
    describe('when event type does not have any corresponding handler', () => {
      describe('when registry is empty', () => {
        it('should return an empty list', () => {
          const handlers = registry.resolve(new TestInitEvent('hello'));

          expect(handlers.length).toBe(0);
        });
      });

      describe('when registry has event handlers', () => {
        beforeEach(() => {
          registry.register(handler);
        });

        it('should return an empty list', () => {
          const handlers = registry.resolve({});

          expect(handlers.length).toBe(0);
        });
      });
    });

    describe('when event type has a corresponding handler', () => {
      beforeEach(() => {
        registry.register(handler);
      });

      it('should return a list or corresponding event handlers', () => {
        const handlers = registry.resolve(new TestInitEvent('hello'));

        expect(handlers.length).toBe(1);
        expect(handlers[0]).toBe(handler);
      });
    });
  });
});
