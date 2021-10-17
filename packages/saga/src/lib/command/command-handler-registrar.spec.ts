import { Observable, of, throwError, Unsubscribable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ICommand } from './command';
import { CommandBus } from './command-bus';
import { ICommandHandler } from './command-handler';
import { CommandHandler } from './command-handler.decorator';
import { CommandHandlerRegistry } from './command-handler-registry';
import { CommandHandlerRegistrar } from './command-handler-registrar';
import { IEvent } from '../event/event';
import { EventBus } from '../event/event-bus';

class TestCommand implements ICommand {
  constructor(readonly payload: string, readonly ok: boolean) {}
}

class TestDoneEvent implements IEvent {
  constructor(readonly payload: string) {}
}

@Injectable({
  providedIn: 'root',
})
class TestHandler implements ICommandHandler<TestCommand> {
  executes = TestCommand;

  execute(command$: Observable<TestCommand>): Observable<IEvent> {
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

describe('CommandHandlerRegistrar', () => {
  let registry: CommandHandlerRegistry;
  let registrar: CommandHandlerRegistrar;
  let commandBus: CommandBus;
  let eventBus: EventBus;
  let handler: TestHandler;
  let saga: TestSaga;

  beforeEach(() => {
    registry = TestBed.inject(CommandHandlerRegistry);
    registrar = TestBed.inject(CommandHandlerRegistrar);
    commandBus = TestBed.inject(CommandBus);
    eventBus = TestBed.inject(EventBus);
    handler = TestBed.inject(TestHandler);
    saga = TestBed.inject(TestSaga);
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

    it('should register the command handler in the command handler registry', () => {
      expect(registry.resolve(new TestCommand('hello', true))).toBeInstanceOf(TestHandler);
    });

    it('should forward commands from the command bus to the command handler', async () => {
      jest.spyOn(handler, 'execute');

      await commandBus.execute(new TestCommand('hello', true));

      expect(handler.execute).toHaveBeenCalledTimes(1);
    });

    it('should forward events from the command handler to event bus', async () => {
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
        jest.spyOn(handler, 'execute');

        await expect(() => commandBus.execute(new TestCommand('hello', true))).rejects.toThrow(
          'No corresponding handler found for command TestCommand',
        );

        expect(handler.execute).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('#scan', () => {
    beforeEach(() => {
      registrar.scan(saga);
    });

    it('should register command handler in registry', () => {
      expect(registry.resolve(new TestCommand('hello', true))).toBeDefined();
    });

    it('should forward commands from command bus to the command handler', async () => {
      jest.spyOn(saga, 'test');

      await commandBus.execute(new TestCommand('hello', true));

      expect(saga.test).toHaveBeenCalledTimes(1);
    });

    it('should forward events from the command handler to event bus', async () => {
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
  });
});
