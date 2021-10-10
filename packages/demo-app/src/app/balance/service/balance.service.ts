import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BalanceService {
  private balance = 0;

  get(): Observable<number> {
    return of(this.balance);
  }

  topUp(amount: number): Observable<boolean> {
    this.balance += amount;

    return of(true);
  }

  /**
   * @internal
   */
  _subtract(amount: number): void {
    this.balance -= amount;
  }
}
