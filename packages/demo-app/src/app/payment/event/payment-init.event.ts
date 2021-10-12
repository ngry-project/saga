import { IEvent } from '@ngry/saga';
import { PaymentDto } from '../dto/payment.dto';

export class PaymentInitEvent implements IEvent {
  constructor(readonly initial: PaymentDto, readonly context: unknown) {}
}
