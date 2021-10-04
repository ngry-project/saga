import { NgModule } from '@angular/core';
import { SagaModule } from '../../../src/lib/saga.module';
import { PaymentHandler } from './command/payment.handler';
import { ContinuePaymentSaga } from './saga/continue-payment.saga';

@NgModule({
  imports: [
    SagaModule.forFeature({
      commands: [
        PaymentHandler,
      ],
      sagas: [
        ContinuePaymentSaga,
      ],
    }),
  ],
})
export class PaymentModule {
}
