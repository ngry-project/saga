import { Observable, of } from 'rxjs';
import { PaymentDto } from '../dto/payment.dto';

export class PaymentDialog {
  constructor() {
  }

  afterClosed(): Observable<PaymentDto> {
    return of({
      amount: 100,
    });
  }
}
