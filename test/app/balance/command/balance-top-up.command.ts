import { ICommand } from '../../../../src/lib/command/command';

export class BalanceTopUpCommand<TContext extends object = object> implements ICommand<TContext> {
  constructor(
    readonly initialAmount: number,
    readonly context: TContext,
  ) {
  }
}
