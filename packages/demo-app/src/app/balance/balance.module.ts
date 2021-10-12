import { NgModule } from '@angular/core';
import { SagaModule } from '@ngry/saga';
import { BalanceTopUpHandler } from './command/balance-top-up.handler';
import { InsufficientFundsHandler } from './event/insufficient-funds.handler';

@NgModule({
  imports: [
    SagaModule.forFeature({
      commands: [BalanceTopUpHandler],
      events: [InsufficientFundsHandler],
    }),
  ],
})
export class BalanceModule {}
