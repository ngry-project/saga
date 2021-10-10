import { Component } from '@angular/core';
import { CommandBus } from '@ngry/saga';
import { PaymentCommand } from './payment/command/payment.command';
import { PaymentContext } from './payment/context/payment.context';
import { PaymentDto } from './payment/dto/payment.dto';

@Component({
  selector: 'ny-root',
  template: `
    <h2>Open SagaDevtools and click the button below</h2>
    <button (click)="start()">Start Saga</button>
  `,
})
export class AppComponent {
  constructor(private readonly commandBus: CommandBus) {
  }

  start() {
    const payment: PaymentDto = {
      amount: 123,
    };
    const context = new PaymentContext(payment);
    const command = new PaymentCommand(payment, context);

    this.commandBus.execute(command);
  }
}
