import { Observable } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { CommandHandler, EventBus, ICommand, Saga } from '@ngry/saga';
import { InsufficientFundsEvent } from '../../balance/event/insufficient-funds.event';
import { BalanceTopUpDoneEvent } from '../../balance/event/balance-top-up-done.event';
import { PaymentCommand } from '../command/payment.command';
import { PaymentDialog } from '../component/payment-dialog';
import { PaymentDoneEvent } from '../event/payment-done.event';
import { PaymentFailEvent } from '../event/payment-fail.event';
import { PaymentService } from '../service/payment.service';
import { PaymentContext } from '../context/payment.context';
import { PaymentDto } from '../dto/payment.dto';

@Injectable({
  providedIn: 'root',
})
export class PaymentFlow {
  constructor(private readonly eventBus: EventBus, private readonly paymentService: PaymentService) {}

  @CommandHandler(PaymentCommand)
  start(command$: Observable<PaymentCommand>): Observable<unknown> {
    return command$.pipe(
      switchMap((command) =>
        new PaymentDialog().afterClosed().pipe(
          filter((payment): payment is PaymentDto => payment != null),
          switchMap((payment) =>
            this.paymentService.submit(payment).pipe(
              tap((result) => {
                if (result.status === 'ok') {
                  this.eventBus.publish(new PaymentDoneEvent(payment, command.context));
                } else {
                  this.eventBus.publish(new PaymentFailEvent(payment, command.context));
                  this.eventBus.publish(new InsufficientFundsEvent(result.insufficientAmount, command.context));
                }
              }),
            ),
          ),
        ),
      ),
    );
  }

  @Saga(BalanceTopUpDoneEvent)
  retryAfterBalanceTopUp(event$: Observable<BalanceTopUpDoneEvent>): Observable<ICommand> {
    return event$.pipe(
      filter((event) => event.context instanceof PaymentContext),
      map((event) => new PaymentCommand((event.context as PaymentContext).payment, event.context)),
    );
  }
}
