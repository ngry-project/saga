import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ICommand } from '../command/command';
import { ICommandHandler } from '../command/command-handler';
import { CommandHandler } from '../command/command-handler.decorator';
import { CommandHandlerRegistry } from '../command/command-handler-registry';
import { IEvent } from '../event/event';
import { EventHandler } from '../event/event-handler.decorator';
import { IEventHandler } from '../event/event-handler';
import { EventHandlerRegistry } from '../event/event-handler-registry';
import { EventListener } from '../event/event-listener.decorator';
import { IEventListener } from '../event/event-listener';
import { EventListenerRegistry } from '../event/event-listener-registry';
import { EventPublisher } from '../event/event-publisher.decorator';
import { IEventPublisher } from '../event/event-publisher';
import { EventPublisherRegistry } from '../event/event-publisher-registry';
import { SagaModule } from '../saga.module';

class SagaInitEvent implements IEvent {
  constructor(readonly payload: string) {}
}

class SagaDoCommand implements ICommand {
  constructor(readonly payload: string) {}
}

class SagaDoneEvent implements IEvent {
  constructor(readonly payload: string) {}
}

@Injectable({
  providedIn: 'root',
})
class TestSaga {
  @EventPublisher()
  readonly init$ = new Subject<SagaInitEvent>();

  init(payload: string) {
    this.init$.next(new SagaInitEvent(payload));
  }

  @EventHandler(SagaInitEvent)
  onInit(event$: Observable<SagaInitEvent>): Observable<ICommand> {
    return event$.pipe(map((event) => new SagaDoCommand(event.payload)));
  }

  @CommandHandler(SagaDoCommand)
  do(command$: Observable<SagaDoCommand>): Observable<IEvent> {
    return command$.pipe(map((command) => new SagaDoneEvent(command.payload)));
  }

  @EventListener(SagaDoneEvent)
  onDone(event: SagaDoneEvent) {
    return event;
  }
}

class InitEvent implements IEvent {
  constructor(readonly payload: string) {}
}

class DoCommand implements ICommand {
  constructor(readonly payload: string) {}
}

class DoneEvent implements IEvent {
  constructor(readonly payload: string) {}
}

@Injectable({
  providedIn: 'root',
})
class InitPublisher implements IEventPublisher {
  events$ = new Subject<InitEvent>();

  init(payload: string) {
    this.events$.next(new InitEvent(payload));
  }
}

@Injectable({
  providedIn: 'root',
})
class InitHandler implements IEventHandler<InitEvent> {
  handles = InitEvent;

  handle(event$: Observable<InitEvent>): Observable<ICommand> {
    return event$.pipe(map((event) => new DoCommand(event.payload)));
  }
}

@Injectable({
  providedIn: 'root',
})
class DoHandler implements ICommandHandler<DoCommand> {
  executes = DoCommand;

  execute(command$: Observable<DoCommand>): Observable<IEvent> {
    return command$.pipe(map((command) => new DoneEvent(command.payload)));
  }
}

@Injectable({
  providedIn: 'root',
})
class DoneListener implements IEventListener<DoneEvent> {
  listensTo = DoneEvent;

  on(event: DoneEvent) {
    return event;
  }
}

describe('SagaFeatureModule', () => {
  let commandHandlerRegistry: CommandHandlerRegistry;
  let eventHandlerRegistry: EventHandlerRegistry;
  let eventPublisherRegistry: EventPublisherRegistry;
  let eventListenerRegistry: EventListenerRegistry;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SagaModule.forFeature({
          events: [InitHandler],
          commands: [DoHandler],
          publishers: [InitPublisher],
          listeners: [DoneListener],
        }),
        SagaModule.forFeature({
          sagas: [TestSaga],
        }),
      ],
    });

    commandHandlerRegistry = TestBed.inject(CommandHandlerRegistry);
    eventHandlerRegistry = TestBed.inject(EventHandlerRegistry);
    eventListenerRegistry = TestBed.inject(EventListenerRegistry);
    eventPublisherRegistry = TestBed.inject(EventPublisherRegistry);
  });

  it('should register command handlers in command handler registry', () => {
    expect(commandHandlerRegistry.resolve(new DoCommand('hello'))).toBe(TestBed.inject(DoHandler));
    expect(commandHandlerRegistry.resolve(new SagaDoCommand('hello'))).toBeDefined();
  });

  it('should register event handlers in event handler registry', () => {
    expect(eventHandlerRegistry.resolve(new InitEvent('hello'))[0]).toBe(TestBed.inject(InitHandler));
    expect(eventHandlerRegistry.resolve(new SagaInitEvent('hello'))[0]).toBeDefined();
  });

  it('should register event listeners in event listener registry', () => {
    expect(eventListenerRegistry.length).toBe(2);
    expect(eventListenerRegistry.has(TestBed.inject(DoneListener))).toBe(true);
  });

  it('should register event publishers in event publisher registry', () => {
    expect(eventPublisherRegistry.length).toBe(2);
    expect(eventPublisherRegistry.has(TestBed.inject(InitPublisher))).toBe(true);
  });
});
