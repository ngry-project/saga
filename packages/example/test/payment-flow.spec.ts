import { TestBed } from '@angular/core/testing';
import { ObservableSpy } from '@ngry/rx';
import { PaymentDoneEvent } from '../src/app/payment/event/payment-done.event';
import { AppModule } from '../src/app/app.module';
import { IEvent } from '../../saga/src/lib/event/event';
import { BalanceTopUpCommand } from '../src/app/balance/command/balance-top-up.command';
import { PaymentFailEvent } from '../src/app/payment/event/payment-fail.event';
import { PaymentContext } from '../src/app/payment/context/payment.context';
import { TestingBus } from '../../saga/src/lib/testing/testing-bus';
import { PaymentDto } from '../src/app/payment/dto/payment.dto';
import { ICommand } from '../../saga/src/lib/command/command';
import { PaymentCommand } from '../src/app/payment/command/payment.command';
import { InsufficientFundsEvent } from '../src/app/balance/event/insufficient-funds.event';
import { BalanceTopUpContext } from '../src/app/balance/context/balance-top-up.context';
import { BalanceTopUpDoneEvent } from '../src/app/balance/event/balance-top-up-done.event';

describe('PaymentFlow', () => {
  let testingBus: TestingBus;
  let sequenceSpy: ObservableSpy<ICommand | IEvent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
      ],
    });

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

    beforeEach(() => {
      testingBus.execute(new PaymentCommand(payment, paymentContext));
    });

    it('should request balance top-up', () => {
      expect(sequenceSpy.values).toEqual([
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
      await testingBus.execute(new PaymentCommand(payment, paymentContext));
    });

    it('should not request balance top-up', () => {
      expect(sequenceSpy.values).toStrictEqual([
        new BalanceTopUpCommand(balanceTopUpAmount, balanceTopUpContext),
        new BalanceTopUpDoneEvent(balanceTopUpAmount, balanceTopUpContext),

        new PaymentCommand(payment, paymentContext),
        new PaymentDoneEvent(payment, paymentContext),
      ]);
    });
  });
});
