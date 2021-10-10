import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SagaModule } from '@ngry/saga';
import { PaymentModule } from './payment/payment.module';
import { BalanceModule } from './balance/balance.module';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    BrowserModule,
    SagaModule.forRoot(),
    BalanceModule,
    PaymentModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {
}
