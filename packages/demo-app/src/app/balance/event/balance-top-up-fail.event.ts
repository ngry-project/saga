import { IEvent } from '@ngry/saga';

export class BalanceTopUpFailEvent<TContext extends object = object>
  implements IEvent<TContext>
{
  constructor(readonly amount: number, readonly context: TContext) {}
}
