import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ICommand, IEventHandler } from '@ngry/saga';
import { InsufficientFundsEvent } from './insufficient-funds.event';
import { BalanceTopUpCommand } from '../command/balance-top-up.command';

@Injectable({
  providedIn: 'root',
})
export class InsufficientFundsHandler implements IEventHandler<InsufficientFundsEvent> {
  handles = InsufficientFundsEvent;

  handle(event$: Observable<InsufficientFundsEvent>): Observable<ICommand> {
    return event$.pipe(map((event) => new BalanceTopUpCommand(event.insufficientAmount, event.context)));
  }
}
