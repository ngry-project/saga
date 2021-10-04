import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ICommandHandler } from '../../../../src/lib/command/command-handler';
import { EventBus } from '../../../../src/lib/event/event-bus';
import { InsufficientFundsEvent } from '../../balance/event/insufficient-funds.event';
import { PaymentDoneEvent } from '../event/payment-done.event';
import { PaymentFailEvent } from '../event/payment-fail.event';
import { PaymentService } from '../service/payment.service';
import { PaymentDialog } from '../component/payment-dialog';
import { PaymentCommand } from './payment.command';

@Injectable({
  providedIn: 'root',
})
export class PaymentHandler implements ICommandHandler<PaymentCommand> {
  executes = PaymentCommand;

  constructor(
    private readonly paymentService: PaymentService,
    private readonly eventBus: EventBus,
  ) {
  }

  execute(command$: Observable<PaymentCommand>): Observable<unknown> {
    return command$.pipe(
      switchMap(command => new PaymentDialog().afterClosed().pipe(
        switchMap(payment => this.paymentService.submit(payment).pipe(
          tap(result => {
            if (result.status === 'ok') {
              this.eventBus.publish(new PaymentDoneEvent(payment, command.flow));
            } else {
              this.eventBus.publish(new PaymentFailEvent(payment, command.flow));
              this.eventBus.publish(new InsufficientFundsEvent(result.insufficientAmount, command.flow));
            }
          }),
        )),
      )),
    );
  }
}
