import { NgModule } from '@angular/core';
import { SagaModule } from '@ngry/saga';
import { PaymentFlow } from './flow/payment.flow';

@NgModule({
  imports: [
    SagaModule.forFeature({
      flows: [PaymentFlow],
    }),
  ],
})
export class PaymentModule {}
