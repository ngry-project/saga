import { IEvent } from '@ngry/saga';
import { PaymentDto } from '../dto/payment.dto';

export class PaymentDoneEvent implements IEvent {
  constructor(readonly payment: PaymentDto, readonly context: unknown) {}
}
