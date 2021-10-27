import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ObservableSpy } from '@ngry/rx';
import { ICommand, IEvent, TestingBus } from '@ngry/saga';
import { PaymentDto } from '../dto/payment.dto';
import { PaymentCommand } from '../command/payment.command';
import { PaymentInitEvent } from '../event/payment-init.event';
import { PaymentDoneEvent } from '../event/payment-done.event';
import { PaymentFailEvent } from '../event/payment-fail.event';
import { PaymentContext } from '../context/payment.context';
import { BalanceTopUpCommand } from '../../balance/command/balance-top-up.command';
import { BalanceTopUpContext } from '../../balance/context/balance-top-up.context';
import { InsufficientFundsEvent } from '../../balance/event/insufficient-funds.event';
import { BalanceTopUpDoneEvent } from '../../balance/event/balance-top-up-done.event';
import { BalanceChangeEvent } from '../../balance/event/balance-change.event';
import { AppModule } from '../../app.module';
import { AppComponent } from '../../app.component';

describe('PaymentSaga', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let testingBus: TestingBus;
  let sequenceSpy: ObservableSpy<ICommand | IEvent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppModule, RouterTestingModule],
    }).compileComponents();

    testingBus = TestBed.inject(TestingBus);
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  beforeEach(() => {
    sequenceSpy = new ObservableSpy(testingBus.sequence$);
  });

  describe('when insufficient funds', () => {
    let payment: PaymentDto;
    let paymentContext: PaymentContext;

    beforeEach(() => {
      payment = {
        amount: 100,
      };
      paymentContext = new PaymentContext(payment);
    });

    beforeEach(() => {
      component.submit();
    });

    it('should request balance top-up', async () => {
      await sequenceSpy.whenCount(10);

      expect(sequenceSpy.values).toStrictEqual([
        new PaymentInitEvent(payment, paymentContext),

        new PaymentCommand(payment, paymentContext),
        new PaymentFailEvent(payment, paymentContext),
        new InsufficientFundsEvent(100, paymentContext),

        new BalanceTopUpCommand(100, paymentContext),
        new BalanceChangeEvent(0, 165),
        new BalanceTopUpDoneEvent(165, paymentContext),

        new PaymentCommand(payment, paymentContext),
        new BalanceChangeEvent(165, 65),
        new PaymentDoneEvent(payment, paymentContext),
      ]);
    });
  });

  describe('when sufficient funds', () => {
    let payment: PaymentDto;
    let paymentContext: PaymentContext;
    let balanceTopUpContext: BalanceTopUpContext;

    beforeEach(() => {
      payment = {
        amount: 100,
      };
      paymentContext = new PaymentContext(payment);

      balanceTopUpContext = new BalanceTopUpContext();
    });

    beforeEach(async () => {
      await testingBus.execute(new BalanceTopUpCommand(100, balanceTopUpContext));
      await sequenceSpy.whenCount(3);
    });

    beforeEach(() => {
      component.submit();
    });

    it('should not request balance top-up', async () => {
      await sequenceSpy.whenCount(7);

      expect(sequenceSpy.values).toStrictEqual([
        new BalanceTopUpCommand(100, balanceTopUpContext),
        new BalanceChangeEvent(0, 165),
        new BalanceTopUpDoneEvent(165, balanceTopUpContext),

        new PaymentInitEvent(payment, paymentContext),
        new PaymentCommand(payment, paymentContext),
        new BalanceChangeEvent(165, 65),
        new PaymentDoneEvent(payment, paymentContext),
      ]);
    });
  });
});
