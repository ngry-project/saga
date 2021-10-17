import { Observable, Unsubscribable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, EventEmitter, Injectable, OnDestroy, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ICommand } from '../command/command';
import { CommandHandler } from '../command/command-handler.decorator';
import { IEvent } from '../event/event';
import { EventHandler } from '../event/event-handler.decorator';
import { EventListener } from '../event/event-listener.decorator';
import { EventListenerRegistry } from '../event/event-listener-registry';
import { EventPublisher } from '../event/event-publisher.decorator';
import { EventPublisherRegistry } from '../event/event-publisher-registry';
import { SagaModule } from '../saga.module';
import { ComponentRegistrar } from './component-registrar';

class PaymentInitEvent implements IEvent {
  constructor(readonly amount: number) {}
}

class PaymentCommand implements ICommand {
  constructor(readonly amount: number) {}
}

class PaymentDoneEvent implements IEvent {
  constructor(readonly result: boolean) {}
}

@Injectable({
  providedIn: 'root',
})
class PaymentSaga {
  @EventHandler(PaymentInitEvent)
  init(event$: Observable<PaymentInitEvent>): Observable<ICommand> {
    return event$.pipe(map((event) => new PaymentCommand(event.amount)));
  }

  @CommandHandler(PaymentCommand)
  make(command$: Observable<PaymentCommand>): Observable<IEvent> {
    return command$.pipe(map((command) => new PaymentDoneEvent(command.amount % 2 === 0)));
  }
}

@Component({
  selector: 'ny-payment-form',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class PaymentFormComponent implements OnDestroy {
  private readonly subscription: Unsubscribable;

  @EventPublisher()
  @Output()
  init$ = new EventEmitter<PaymentInitEvent>();

  constructor(private readonly componentRegistrar: ComponentRegistrar) {
    this.subscription = this.componentRegistrar.scan(this);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  @EventListener(PaymentDoneEvent)
  afterDone(event: PaymentDoneEvent) {
    console.log(event.result ? 'Payment complete' : 'Payment failed');
  }

  submit() {
    this.init$.emit(new PaymentInitEvent(123));
  }
}

describe('ComponentRegistrar', () => {
  let eventListenerRegistry: EventListenerRegistry;
  let eventPublisherRegistry: EventPublisherRegistry;

  let fixture: ComponentFixture<PaymentFormComponent>;
  let component: PaymentFormComponent;

  beforeEach(() => {
    return TestBed.configureTestingModule({
      imports: [
        SagaModule.forFeature({
          sagas: [PaymentSaga],
        }),
      ],
      declarations: [PaymentFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    eventListenerRegistry = TestBed.inject(EventListenerRegistry);
    eventPublisherRegistry = TestBed.inject(EventPublisherRegistry);
  });

  describe('#scan', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(PaymentFormComponent);
      component = fixture.componentInstance;
    });

    it('should register an event listener', () => {
      expect(eventListenerRegistry.length).toBe(1);
    });

    it('should register an event publisher', () => {
      expect(eventPublisherRegistry.length).toBe(1);
    });

    it('should return a subscription', () => {
      fixture.destroy();

      expect(eventListenerRegistry.length).toBe(0);
      expect(eventPublisherRegistry.length).toBe(0);
    });
  });
});
