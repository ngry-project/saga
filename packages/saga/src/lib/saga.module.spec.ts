import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ICommand } from './command/command';
import { CommandHandler } from './command/command-handler.decorator';
import { CommandHandlerRegistry } from './command/command-handler-registry';
import { IEvent } from './event/event';
import { EventPublisher } from './event/event-publisher.decorator';
import { EventHandler } from './event/event-handler.decorator';
import { EventPublisherRegistry } from './event/event-publisher-registry';
import { EventHandlerRegistry } from './event/event-handler-registry';
import { SagaModule } from './saga.module';
import { SAGA_ROOT_OPTIONS } from './configuration/saga-root-options';

class TestInitEvent implements IEvent {
  constructor(readonly payload: string) {}
}

class TestCommand implements ICommand {
  constructor(readonly payload: string) {}
}

class TestDoneEvent implements IEvent {
  constructor(readonly result: string) {}
}

@Injectable({
  providedIn: 'root',
})
class TestSaga {
  @EventPublisher()
  init$ = new BehaviorSubject(new TestInitEvent('tester'));

  @EventHandler(TestInitEvent)
  init(event$: Observable<TestInitEvent>): Observable<ICommand> {
    return event$.pipe(map((event) => new TestCommand(event.payload)));
  }

  @CommandHandler(TestCommand)
  test(command$: Observable<TestCommand>): Observable<IEvent> {
    return command$.pipe(map((command) => new TestDoneEvent('hello ' + command.payload)));
  }
}

describe('SagaModule', () => {
  let eventPublisherRegistry: EventPublisherRegistry;
  let eventHandlerRegistry: EventHandlerRegistry;
  let commandHandlerRegistry: CommandHandlerRegistry;

  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('#forRoot', () => {
    describe('when options provided', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [
            SagaModule.forRoot({
              debug: true,
            }),
          ],
        });
      });

      it('should provide root configuration', () => {
        const options = TestBed.inject(SAGA_ROOT_OPTIONS);

        expect(options).toEqual({
          debug: true,
        });
      });
    });

    describe('when options not provided', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [SagaModule.forRoot()],
        });
      });

      it('should provide root configuration', () => {
        const options = TestBed.inject(SAGA_ROOT_OPTIONS);

        expect(options).toEqual({});
      });
    });
  });

  describe('#forFeature', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          SagaModule.forFeature({
            sagas: [TestSaga],
          }),
        ],
      });
    });

    beforeEach(() => {
      eventPublisherRegistry = TestBed.inject(EventPublisherRegistry);
      eventHandlerRegistry = TestBed.inject(EventHandlerRegistry);
      commandHandlerRegistry = TestBed.inject(CommandHandlerRegistry);
    });

    it('should register event publisher', () => {
      expect(eventPublisherRegistry.length).toBe(1);
    });

    it('should register event handler', () => {
      expect(eventHandlerRegistry.length).toBe(1);
    });

    it('should register command handler', () => {
      expect(commandHandlerRegistry.length).toBe(1);
    });
  });
});
