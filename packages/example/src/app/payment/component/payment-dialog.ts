import { Observable, of } from 'rxjs';
import { PaymentDto } from '../dto/payment.dto';

export class PaymentDialog {

  afterClosed(): Observable<PaymentDto | null> {
    return of({
      amount: 100,
    });
  }
}
