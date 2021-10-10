import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BalanceService } from '../../balance/service/balance.service';
import { PaymentDto } from '../dto/payment.dto';

export interface PaymentDone {
  readonly status: 'ok';
}

export interface PaymentFail {
  readonly status: 'error';
  readonly insufficientAmount: number;
}

export type PaymentResult = PaymentDone | PaymentFail;

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(private readonly balanceService: BalanceService) {
  }

  submit(payment: PaymentDto): Observable<PaymentResult> {
    return this.balanceService.get().pipe(
      map((balance) => {
        if (balance >= payment.amount) {
          this.balanceService._subtract(payment.amount);

          return {
            status: 'ok',
          };
        } else {
          return {
            status: 'error',
            insufficientAmount: payment.amount - balance,
          };
        }
      }),
    );
  }
}
