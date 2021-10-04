import { IFlowCommand } from '../../../../src/lib/flow/flow-command';
import { IFlow } from '../../../../src/lib/flow/flow';

export class BalanceTopUpCommand<TFlow extends IFlow = IFlow> implements IFlowCommand<TFlow> {
  constructor(
    readonly initialAmount: number,
    readonly flow: TFlow,
  ) {
  }
}
