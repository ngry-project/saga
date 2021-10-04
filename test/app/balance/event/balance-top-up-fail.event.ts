import { IFlow } from '../../../../src/lib/flow/flow';
import { IFlowEvent } from '../../../../src/lib/flow/flow-event';

export class BalanceTopUpFailEvent<TFlow extends IFlow = IFlow> implements IFlowEvent<TFlow> {
  constructor(
    readonly amount: number,
    readonly flow: TFlow,
  ) {
  }
}
