import { IEvent } from '@ngry/saga';
import { PaymentDto } from '../dto/payment.dto';

export class PaymentFailEvent<TContext extends object = object> implements IEvent<TContext> {
  constructor(
    readonly payment: PaymentDto,
    readonly context: TContext,
  ) {
  }
}
