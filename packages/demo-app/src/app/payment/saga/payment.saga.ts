import { Observable, of } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { CommandHandler, EventHandler, ICommand, IEvent } from '@ngry/saga';
import { InsufficientFundsEvent } from '../../balance/event/insufficient-funds.event';
import { BalanceTopUpDoneEvent } from '../../balance/event/balance-top-up-done.event';
import { PaymentCommand } from '../command/payment.command';
import { PaymentDialog } from '../component/payment-dialog';
import { PaymentInitEvent } from '../event/payment-init.event';
import { PaymentDoneEvent } from '../event/payment-done.event';
import { PaymentFailEvent } from '../event/payment-fail.event';
import { PaymentService } from '../service/payment.service';
import { PaymentContext } from '../context/payment.context';
import { PaymentDto } from '../dto/payment.dto';

@Injectable({
  providedIn: 'root',
})
export class PaymentSaga {
  constructor(private readonly paymentService: PaymentService) {}

  @EventHandler(PaymentInitEvent)
  init(event$: Observable<PaymentInitEvent>): Observable<ICommand> {
    return event$.pipe(map((event) => new PaymentCommand(event.initial, event.context)));
  }

  @CommandHandler(PaymentCommand)
  makePayment(command$: Observable<PaymentCommand>): Observable<IEvent> {
    return command$.pipe(
      switchMap((command) =>
        new PaymentDialog(command.initial).afterClosed().pipe(
          filter((payment): payment is PaymentDto => payment != null),
          switchMap((payment) =>
            this.paymentService.submit(payment).pipe(
              switchMap((result) => {
                if (result.status === 'ok') {
                  return of(new PaymentDoneEvent(payment, command.context));
                } else {
                  return of(
                    new PaymentFailEvent(payment, command.context),
                    new InsufficientFundsEvent(result.insufficientAmount, command.context),
                  );
                }
              }),
            ),
          ),
        ),
      ),
    );
  }

  @EventHandler(BalanceTopUpDoneEvent)
  retryAfterBalanceTopUpDone(event$: Observable<BalanceTopUpDoneEvent>): Observable<ICommand> {
    return event$.pipe(
      filter((event) => event.context instanceof PaymentContext),
      map((event) => new PaymentCommand((event.context as PaymentContext).payment, event.context)),
    );
  }
}
