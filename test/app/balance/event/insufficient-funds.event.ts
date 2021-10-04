import { IFlow } from '../../../../src/lib/flow/flow';
import { IFlowEvent } from '../../../../src/lib/flow/flow-event';

export class InsufficientFundsEvent<TFlow extends IFlow = IFlow> implements IFlowEvent<TFlow> {
  constructor(
    readonly insufficientAmount: number,
    readonly flow: TFlow,
  ) {
  }
}
