import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ICommandHandler, IEvent } from '@ngry/saga';
import { BalanceTopUpDoneEvent } from '../event/balance-top-up-done.event';
import { BalanceTopUpFailEvent } from '../event/balance-top-up-fail.event';
import { BalanceTopUpDialog } from '../component/balance-top-up-dialog';
import { BalanceService } from '../service/balance.service';
import { BalanceTopUpCommand } from './balance-top-up.command';

@Injectable({
  providedIn: 'root',
})
export class BalanceTopUpHandler implements ICommandHandler<BalanceTopUpCommand> {
  readonly executes = BalanceTopUpCommand;

  constructor(private readonly balanceService: BalanceService) {}

  execute(command$: Observable<BalanceTopUpCommand>): Observable<IEvent> {
    return command$.pipe(
      switchMap((command) =>
        new BalanceTopUpDialog(command.initialAmount).afterClosed().pipe(
          switchMap((form) =>
            this.balanceService.topUp(form.amount * 1.65).pipe(
              map((result) => {
                if (result) {
                  return new BalanceTopUpDoneEvent(form.amount, command.context);
                } else {
                  return new BalanceTopUpFailEvent(form.amount, command.context);
                }
              }),
            ),
          ),
        ),
      ),
    );
  }
}
