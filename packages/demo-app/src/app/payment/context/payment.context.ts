import { PaymentDto } from '../dto/payment.dto';

export class PaymentContext {
  constructor(readonly payment: PaymentDto) {}
}
