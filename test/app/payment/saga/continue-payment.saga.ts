import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ICommand } from '../../../../src/lib/command/command';
import { ofFlow } from '../../../../src/lib/flow/of-flow';
import { ISaga } from '../../../../src/lib/saga/saga';
import { BalanceTopUpDoneEvent } from '../../balance/event/balance-top-up-done.event';
import { PaymentFlow } from '../flow/payment.flow';
import { PaymentCommand } from '../command/payment.command';

@Injectable({
  providedIn: 'root',
})
export class ContinuePaymentSaga implements ISaga<BalanceTopUpDoneEvent<PaymentFlow>> {
  handles = BalanceTopUpDoneEvent;

  handle(event$: Observable<BalanceTopUpDoneEvent<PaymentFlow>>): Observable<ICommand> {
    return event$.pipe(
      ofFlow(PaymentFlow),
      map(event => new PaymentCommand(event.flow.payment, event.flow)),
    );
  }
}
