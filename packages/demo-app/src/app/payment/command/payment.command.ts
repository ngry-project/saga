import { ICommand } from '@ngry/saga';
import { PaymentDto } from '../dto/payment.dto';

export class PaymentCommand implements ICommand {
  constructor(readonly initial: PaymentDto, readonly context: unknown) {}
}
