import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { EventBus, ICommandHandler } from '@ngry/saga';
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

  constructor(private readonly balanceService: BalanceService, private readonly eventBus: EventBus) {}

  execute(command$: Observable<BalanceTopUpCommand>): Observable<unknown> {
    return command$.pipe(
      switchMap((command) =>
        new BalanceTopUpDialog(command.initialAmount).afterClosed().pipe(
          switchMap((form) =>
            this.balanceService.topUp(form.amount).pipe(
              tap((result) => {
                if (result) {
                  this.eventBus.publish(new BalanceTopUpDoneEvent(form.amount, command.context));
                } else {
                  this.eventBus.publish(new BalanceTopUpFailEvent(form.amount, command.context));
                }
              }),
            ),
          ),
        ),
      ),
    );
  }
}
