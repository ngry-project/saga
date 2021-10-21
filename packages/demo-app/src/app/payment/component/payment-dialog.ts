import { Observable, of } from 'rxjs';
import { PaymentDto } from '../dto/payment.dto';

export class PaymentDialog {
  constructor(private readonly payment: PaymentDto) {}

  afterClosed(): Observable<PaymentDto | null> {
    return of(this.payment);
  }
}
