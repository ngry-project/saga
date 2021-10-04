import { PaymentDto } from '../dto/payment.dto';
import { ICommand } from '../../../../src/lib/command/command';

export class PaymentCommand<TContext extends object = object> implements ICommand<TContext> {
  constructor(
    readonly initial: PaymentDto,
    readonly context: TContext,
  ) {
  }
}
