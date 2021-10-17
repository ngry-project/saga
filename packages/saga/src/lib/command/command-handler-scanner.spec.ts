import { Observable, of, throwError, Unsubscribable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { IEvent } from '../event/event';
import { EventBus } from '../event/event-bus';
import { ICommand } from './command';
import { CommandBus } from './command-bus';
import { CommandHandler } from './command-handler.decorator';
import { CommandHandlerRegistry } from './command-handler-registry';
import { CommandHandlerScanner } from './command-handler-scanner';

class TestCommand implements ICommand {
  constructor(readonly payload: string, readonly ok: boolean) {}
}

class TestDoneEvent implements IEvent {
  constructor(readonly payload: string) {}
}

@Injectable({
  providedIn: 'root',
})
class TestSaga {
  @CommandHandler(TestCommand)
  test(command$: Observable<TestCommand>): Observable<IEvent> {
    return command$.pipe(
      switchMap((command) => {
        if (command.ok) {
          return of(new TestDoneEvent('world'));
        } else {
          return throwError(new Error('Test error'));
        }
      }),
    );
  }
}

describe('CommandHandlerScanner', () => {
  let registry: CommandHandlerRegistry;
  let scanner: CommandHandlerScanner;
  let commandBus: CommandBus;
  let eventBus: EventBus;
  let saga: TestSaga;

  beforeEach(() => {
    registry = TestBed.inject(CommandHandlerRegistry);
    scanner = TestBed.inject(CommandHandlerScanner);
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

    it('should register command handler in registry', () => {
      expect(registry.resolve(new TestCommand('hello', true))).toBeDefined();
    });

    it('should forward commands from command bus to the command handler', async () => {
      jest.spyOn(saga, 'test');

      await commandBus.execute(new TestCommand('hello', true));

      expect(saga.test).toHaveBeenCalledTimes(1);
    });

    it('should forward events from the command handler to the event bus', async () => {
      jest.spyOn(eventBus, 'publish');

      await commandBus.execute(new TestCommand('hello', true));

      expect(eventBus.publish).toHaveBeenCalledTimes(1);
      expect(eventBus.publish).toHaveBeenLastCalledWith(new TestDoneEvent('world'));
    });

    it('should catch and print errors to console', async () => {
      jest.spyOn(eventBus, 'publish');

      await commandBus.execute(new TestCommand('hello', false));

      expect(console.error).toHaveBeenCalledTimes(1);
      expect(eventBus.publish).toHaveBeenCalledTimes(0);
    });

    describe('subscription', () => {
      beforeEach(() => {
        subscription.unsubscribe();
      });

      it('should unbind the command handler from the command bus', async () => {
        jest.spyOn(saga, 'test');

        await expect(() => commandBus.execute(new TestCommand('hello', true))).rejects.toThrow(
          'No corresponding handler found for command TestCommand',
        );

        expect(saga.test).toHaveBeenCalledTimes(0);
      });
    });
  });
});
