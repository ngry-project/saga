import { TestBed } from '@angular/core/testing';
import { ObservableSpy } from '@ngry/rx';
import { IEvent } from '../../src/lib/event/event';
import { ICommand } from '../../src/lib/command/command';
import { TestingBus } from '../../src/lib/testing/testing-bus';

import { BalanceTopUpCommand } from '../app/balance/command/balance-top-up.command';
import { InsufficientFundsEvent } from '../app/balance/event/insufficient-funds.event';
import { BalanceTopUpDoneEvent } from '../app/balance/event/balance-top-up-done.event';
import { BalanceTopUpContext } from '../app/balance/context/balance-top-up.context';

import { PaymentContext } from '../app/payment/context/payment.context';
import { PaymentCommand } from '../app/payment/command/payment.command';
import { PaymentDoneEvent } from '../app/payment/event/payment-done.event';
import { PaymentFailEvent } from '../app/payment/event/payment-fail.event';
import { PaymentDto } from '../app/payment/dto/payment.dto';

import { AppModule } from '../app/app.module';

describe('Payment flow', () => {
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
