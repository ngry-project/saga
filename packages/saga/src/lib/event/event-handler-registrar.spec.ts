import { Observable, of, throwError, Unsubscribable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ICommand } from '../command/command';
import { CommandBus } from '../command/command-bus';
import { IEvent } from './event';
import { EventBus } from './event-bus';
import { IEventHandler } from './event-handler';
import { EventHandlerRegistry } from './event-handler-registry';
import { EventHandlerRegistrar } from './event-handler-registrar';

class TestInitEvent implements IEvent {
  constructor(readonly payload: string, readonly ok: boolean) {}
}

class TestCommand implements ICommand {
  constructor(readonly payload: string) {}
}

@Injectable({
  providedIn: 'root',
})
class TestInitHandler implements IEventHandler<TestInitEvent> {
  handles = TestInitEvent;

  handle(event$: Observable<TestInitEvent>): Observable<ICommand> {
    return event$.pipe(
      switchMap((event) => {
        if (event.ok) {
          return of(new TestCommand('world'));
        } else {
          return throwError(new Error('Test error'));
        }
      }),
    );
  }
}

describe('EventHandlerRegistrar', () => {
  let registry: EventHandlerRegistry;
  let registrar: EventHandlerRegistrar;
  let commandBus: CommandBus;
  let eventBus: EventBus;
  let handler: TestInitHandler;

  beforeEach(() => {
    registry = TestBed.inject(EventHandlerRegistry);
    registrar = TestBed.inject(EventHandlerRegistrar);
    commandBus = TestBed.inject(CommandBus);
    eventBus = TestBed.inject(EventBus);
    handler = TestBed.inject(TestInitHandler);
  });

  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('#register', () => {
    let subscription: Unsubscribable;

    beforeEach(() => {
      subscription = registrar.register(handler);
    });

    it('should register event handler in registry', () => {
      expect(registry.length).toBe(1);
    });

    it('should forward events from the event bus to the event handler', async () => {
      jest.spyOn(handler, 'handle');

      await eventBus.publish(new TestInitEvent('hello', true));

      expect(handler.handle).toHaveBeenCalledTimes(1);
    });

    it('should forward commands from the event handler to the command bus', async () => {
      jest.spyOn(commandBus, 'execute');

      await eventBus.publish(new TestInitEvent('hello', true));

      expect(commandBus.execute).toHaveBeenCalledTimes(1);
      expect(commandBus.execute).toHaveBeenLastCalledWith(new TestCommand('world'));
    });

    it('should catch and print errors to console', async () => {
      jest.spyOn(commandBus, 'execute');

      await eventBus.publish(new TestInitEvent('hello', false));

      expect(console.error).toHaveBeenCalledTimes(1);
      expect(commandBus.execute).toHaveBeenCalledTimes(0);
    });

    describe('subscription', () => {
      beforeEach(() => {
        subscription.unsubscribe();
      });

      it('should unregister the event handler from the registry', () => {
        expect(registry.length).toBe(0);
      });

      it('should unbind the handler from the event bus', async () => {
        jest.spyOn(handler, 'handle');

        await eventBus.publish(new TestInitEvent('hello', true));

        expect(handler.handle).toHaveBeenCalledTimes(0);
      });
    });
  });
});
