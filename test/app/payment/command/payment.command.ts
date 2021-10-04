import { IFlow } from '../../../../src/lib/flow/flow';
import { IFlowCommand } from '../../../../src/lib/flow/flow-command';
import { PaymentDto } from '../dto/payment.dto';

export class PaymentCommand<TFlow extends IFlow = IFlow> implements IFlowCommand<TFlow> {
  constructor(
    readonly initial: PaymentDto,
    readonly flow: TFlow,
  ) {
  }
}
