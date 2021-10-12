import { NgModule } from '@angular/core';
import { SagaModule } from '@ngry/saga';
import { PaymentSaga } from './saga/payment.saga';

@NgModule({
  imports: [
    SagaModule.forFeature({
      sagas: [PaymentSaga],
    }),
  ],
})
export class PaymentModule {}
