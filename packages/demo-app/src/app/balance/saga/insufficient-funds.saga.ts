import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ICommand, ISaga } from '@ngry/saga';
import { InsufficientFundsEvent } from '../event/insufficient-funds.event';
import { BalanceTopUpCommand } from '../command/balance-top-up.command';

@Injectable({
  providedIn: 'root',
})
export class InsufficientFundsSaga implements ISaga<InsufficientFundsEvent> {
  handles = InsufficientFundsEvent;

  handle(event$: Observable<InsufficientFundsEvent>): Observable<ICommand> {
    return event$.pipe(
      map(
        (event) =>
          new BalanceTopUpCommand(event.insufficientAmount, event.context)
      )
    );
  }
}
