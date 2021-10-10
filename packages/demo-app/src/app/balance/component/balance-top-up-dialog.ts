import { Observable, of } from 'rxjs';
import { BalanceTopUpForm } from './balance-top-up-form';

export class BalanceTopUpDialog {
  constructor(private readonly initialAmount: number) {}

  afterClosed(): Observable<BalanceTopUpForm> {
    return of({
      amount: this.initialAmount,
      credentials: {
        number: '1234 5678 9012 3456',
        cvv: '123',
        month: '04',
        year: '2026',
      },
    });
  }
}
