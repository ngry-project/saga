import { NgModule } from '@angular/core';
import { SagaModule } from '@ngry/saga';
import { BalanceTopUpHandler } from './command/balance-top-up.handler';
import { InsufficientFundsSaga } from './saga/insufficient-funds.saga';

@NgModule({
  imports: [
    SagaModule.forFeature({
      commands: [
        BalanceTopUpHandler,
      ],
      sagas: [
        InsufficientFundsSaga,
      ],
    }),
  ],
})
export class BalanceModule {
}
