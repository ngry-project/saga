import { ICommand } from '@ngry/saga';
import { PaymentDto } from '../dto/payment.dto';

export class PaymentCommand<TContext extends object = object>
  implements ICommand<TContext>
{
  constructor(readonly initial: PaymentDto, readonly context: TContext) {}
}
