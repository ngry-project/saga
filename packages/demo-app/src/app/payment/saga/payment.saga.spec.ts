import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ObservableSpy } from '@ngry/rx';
import { ICommand, IEvent, TestingBus } from '@ngry/saga';
import { PaymentDoneEvent } from '../event/payment-done.event';
import { AppModule } from '../../app.module';
import { BalanceTopUpCommand } from '../../balance/command/balance-top-up.command';
import { PaymentFailEvent } from '../event/payment-fail.event';
import { PaymentContext } from '../context/payment.context';
import { PaymentDto } from '../dto/payment.dto';
import { PaymentCommand } from '../command/payment.command';
import { InsufficientFundsEvent } from '../../balance/event/insufficient-funds.event';
import { BalanceTopUpContext } from '../../balance/context/balance-top-up.context';
import { BalanceTopUpDoneEvent } from '../../balance/event/balance-top-up-done.event';
import { Router } from '@angular/router';
import { PaymentInitEvent } from '../event/payment-init.event';

describe('PaymentSaga', () => {
  let router: Router;
  let testingBus: TestingBus;
  let sequenceSpy: ObservableSpy<ICommand | IEvent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, RouterTestingModule],
    });

    router = TestBed.inject(Router);
    testingBus = TestBed.inject(TestingBus);
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

    beforeEach(async () => {
      await router.navigate([], {
        queryParams: {
          dialog: 'payment',
          amount: 100,
        },
      });
    });

    it('should request balance top-up', () => {
      expect(sequenceSpy.values).toStrictEqual([
        new PaymentInitEvent(payment, paymentContext),

        new PaymentCommand(payment, paymentContext),
        new PaymentFailEvent(payment, paymentContext),
        new InsufficientFundsEvent(payment.amount, paymentContext),

        new BalanceTopUpCommand(payment.amount, paymentContext),
        new BalanceTopUpDoneEvent(payment.amount, paymentContext),

        new PaymentCommand(payment, paymentContext),
        new PaymentDoneEvent(payment, paymentContext),
      ]);
    });
  });

  describe('when sufficient funds', () => {
    let payment: PaymentDto;
    let paymentContext: PaymentContext;
    let balanceTopUpAmount: number;
    let balanceTopUpContext: BalanceTopUpContext;

    beforeEach(() => {
      payment = {
        amount: 100,
      };
      paymentContext = new PaymentContext(payment);

      balanceTopUpAmount = 100;
      balanceTopUpContext = new BalanceTopUpContext();
    });

    beforeEach(async () => {
      await testingBus.execute(new BalanceTopUpCommand(balanceTopUpAmount, balanceTopUpContext));
    });

    beforeEach(async () => {
      await router.navigate([], {
        queryParams: {
          dialog: 'payment',
          amount: 100,
        },
      });
    });

    it('should not request balance top-up', () => {
      expect(sequenceSpy.values).toStrictEqual([
        new BalanceTopUpCommand(balanceTopUpAmount, balanceTopUpContext),
        new BalanceTopUpDoneEvent(balanceTopUpAmount, balanceTopUpContext),

        new PaymentInitEvent(payment, paymentContext),
        new PaymentCommand(payment, paymentContext),
        new PaymentDoneEvent(payment, paymentContext),
      ]);
    });
  });
});
