import { Subject, Unsubscribable } from 'rxjs';
import { Component, OnDestroy, Output } from '@angular/core';
import { ComponentScanner, EventPublisher } from '@ngry/saga';
import { PaymentDto } from './payment/dto/payment.dto';
import { PaymentInitEvent } from './payment/event/payment-init.event';
import { PaymentContext } from './payment/context/payment.context';

@Component({
  selector: 'ny-root',
  template: `
    <h2>Open SagaDevtools and click the button below</h2>
    <button (click)="submit()">Start Saga</button>
  `,
})
export class AppComponent implements OnDestroy {
  private subscription: Unsubscribable;

  @EventPublisher()
  @Output()
  readonly init$ = new Subject<PaymentInitEvent>();

  constructor(scanner: ComponentScanner) {
    this.subscription = scanner.scan(this);
  }

  submit() {
    const payment: PaymentDto = {
      amount: 100,
    };

    this.init$.next(new PaymentInitEvent(payment, new PaymentContext(payment)));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
