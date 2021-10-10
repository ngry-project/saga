import { ICommand } from '@ngry/saga';

export class BalanceTopUpCommand<TContext extends object = object>
  implements ICommand<TContext>
{
  constructor(readonly initialAmount: number, readonly context: TContext) {}
}
