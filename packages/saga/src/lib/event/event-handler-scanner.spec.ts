import { Observable, of, throwError, Unsubscribable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ICommand } from '../command/command';
import { CommandBus } from '../command/command-bus';
import { IEvent } from './event';
import { EventBus } from './event-bus';
import { EventHandler } from './event-handler.decorator';
import { EventHandlerRegistry } from './event-handler-registry';
import { EventHandlerScanner } from './event-handler-scanner';

class TestInitEvent implements IEvent {
  constructor(readonly payload: string, readonly ok: boolean) {}
}

class TestCommand implements ICommand {
  constructor(readonly payload: string) {}
}

@Injectable({
  providedIn: 'root',
})
class TestSaga {
  @EventHandler(TestInitEvent)
  initTest(event$: Observable<TestInitEvent>): Observable<ICommand> {
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

describe('EventHandlerScanner', () => {
  let registry: EventHandlerRegistry;
  let scanner: EventHandlerScanner;
  let commandBus: CommandBus;
  let eventBus: EventBus;
  let saga: TestSaga;

  beforeEach(() => {
    registry = TestBed.inject(EventHandlerRegistry);
    scanner = TestBed.inject(EventHandlerScanner);
    commandBus = TestBed.inject(CommandBus);
    eventBus = TestBed.inject(EventBus);
    saga = TestBed.inject(TestSaga);
  });

  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('#scan', () => {
    let subscription: Unsubscribable;

    beforeEach(() => {
      subscription = scanner.scan(saga);
    });

    it('should register event handler in registry', () => {
      expect(registry.length).toBe(1);
    });

    it('should forward events from event bus to the event handler', async () => {
      jest.spyOn(saga, 'initTest');

      await eventBus.publish(new TestInitEvent('hello', true));

      expect(saga.initTest).toHaveBeenCalledTimes(1);
    });

    it('should forward commands from the event handler to command bus', async () => {
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

      it('should unregister the event handler(s) from the registry', () => {
        expect(registry.length).toBe(0);
      });

      it('should unbind the event handler(s) from the event bus', async () => {
        jest.spyOn(saga, 'initTest');

        await eventBus.publish(new TestInitEvent('hello', true));

        expect(saga.initTest).toHaveBeenCalledTimes(0);
      });
    });
  });
});
