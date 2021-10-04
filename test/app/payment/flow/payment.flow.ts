import { PaymentDto } from '../dto/payment.dto';

export class PaymentFlow {
  constructor(
    readonly payment: PaymentDto,
  ) {
  }
}
