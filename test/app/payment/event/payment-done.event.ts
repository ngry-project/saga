import { IFlow } from '../../../../src/lib/flow/flow';
import { IFlowEvent } from '../../../../src/lib/flow/flow-event';
import { PaymentDto } from '../dto/payment.dto';

export class PaymentDoneEvent<TFlow extends IFlow = IFlow> implements IFlowEvent<TFlow> {
  constructor(
    readonly payment: PaymentDto,
    readonly flow: TFlow,
  ) {
  }
}
