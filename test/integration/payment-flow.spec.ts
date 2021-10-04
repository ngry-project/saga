import { TestBed } from '@angular/core/testing';
import { ObservableSpy } from '@ngry/rx';
import { IEvent } from '../../src/lib/event/event';
import { ICommand } from '../../src/lib/command/command';
import { TestingBus } from '../../src/lib/testing/testing-bus';

import { BalanceTopUpCommand } from '../app/balance/command/balance-top-up.command';
import { InsufficientFundsEvent } from '../app/balance/event/insufficient-funds.event';
import { BalanceTopUpDoneEvent } from '../app/balance/event/balance-top-up-done.event';

import { PaymentFlow } from '../app/payment/flow/payment.flow';
import { PaymentCommand } from '../app/payment/command/payment.command';
import { PaymentDoneEvent } from '../app/payment/event/payment-done.event';
import { PaymentFailEvent } from '../app/payment/event/payment-fail.event';
import { PaymentDto } from '../app/payment/dto/payment.dto';

import { AppModule } from '../app/app.module';
import { BalanceTopUpFlow } from '../app/balance/flow/balance-top-up.flow';

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
    let flow: PaymentFlow;

    beforeEach(() => {
      payment = {
        amount: 100,
      };
      flow = new PaymentFlow(payment);
    });

    beforeEach(() => {
      testingBus.execute(new PaymentCommand(payment, flow));
    });

    it('should request balance top-up', () => {
      expect(sequenceSpy.values).toEqual([
        new PaymentCommand(payment, flow),
        new PaymentFailEvent(payment, flow),
        new InsufficientFundsEvent(payment.amount, flow),

        new BalanceTopUpCommand(payment.amount, flow),
        new BalanceTopUpDoneEvent(payment.amount, flow),

        new PaymentCommand(payment, flow),
        new PaymentDoneEvent(payment, flow),
      ]);
    });
  });

  describe('when sufficient funds', () => {
    let payment: PaymentDto;
    let paymentFlow: PaymentFlow;
    let balanceTopUpAmount: number;
    let balanceTopUpFlow: BalanceTopUpFlow;

    beforeEach(() => {
      payment = {
        amount: 100,
      };
      paymentFlow = new PaymentFlow(payment);

      balanceTopUpAmount = 100;
      balanceTopUpFlow = new BalanceTopUpFlow();
    });

    beforeEach(async () => {
      await testingBus.execute(new BalanceTopUpCommand(balanceTopUpAmount, balanceTopUpFlow));
    });

    beforeEach(async () => {
      await testingBus.execute(new PaymentCommand(payment, paymentFlow));
    });

    it('should not request balance top-up', () => {
      expect(sequenceSpy.values).toStrictEqual([
        new BalanceTopUpCommand(balanceTopUpAmount, balanceTopUpFlow),
        new BalanceTopUpDoneEvent(balanceTopUpAmount, balanceTopUpFlow),

        new PaymentCommand(payment, paymentFlow),
        new PaymentDoneEvent(payment, paymentFlow),
      ]);
    });
  });
});
