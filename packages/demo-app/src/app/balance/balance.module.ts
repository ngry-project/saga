import { NgModule } from '@angular/core';
import { SagaModule } from '@ngry/saga';
import { BalanceTopUpHandler } from './command/balance-top-up.handler';
import { InsufficientFundsHandler } from './event/insufficient-funds.handler';
import { BalanceService } from './service/balance.service';

@NgModule({
  imports: [
    SagaModule.forFeature({
      commands: [BalanceTopUpHandler],
      events: [InsufficientFundsHandler],
      sagas: [BalanceService],
    }),
  ],
})
export class BalanceModule {}
