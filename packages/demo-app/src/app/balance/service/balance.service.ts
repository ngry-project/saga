import { Observable, of, Subject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { EventPublisher } from '@ngry/saga';
import { BalanceChangeEvent } from '../event/balance-change.event';

@Injectable({
  providedIn: 'root',
})
export class BalanceService {
  private readonly _change = new Subject<BalanceChangeEvent>();

  @EventPublisher()
  readonly onChange: Observable<BalanceChangeEvent> = this._change.asObservable();

  private balance = 0;

  get(): Observable<number> {
    return of(this.balance).pipe(delay(1000));
  }

  topUp(amount: number): Observable<boolean> {
    const from = this.balance;

    this.balance += amount;

    const to = this.balance;

    this._change.next(new BalanceChangeEvent(from, to));

    return of(true).pipe(delay(1000));
  }

  /**
   * @internal
   */
  _subtract(amount: number): void {
    const from = this.balance;

    this.balance -= amount;

    const to = this.balance;

    this._change.next(new BalanceChangeEvent(from, to));
  }
}
