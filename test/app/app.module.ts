import { NgModule } from '@angular/core';
import { SagaModule } from '../../src/lib/saga.module';
import { BalanceModule } from './balance/balance.module';
import { PaymentModule } from './payment/payment.module';

@NgModule({
  imports: [
    SagaModule.forRoot({
      debug: false,
    }),
    BalanceModule,
    PaymentModule,
  ],
})
export class AppModule {
}
