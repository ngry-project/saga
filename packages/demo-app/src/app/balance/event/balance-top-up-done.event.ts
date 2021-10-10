import { IEvent } from '@ngry/saga';

export class BalanceTopUpDoneEvent<TContext extends object = object>
  implements IEvent<TContext>
{
  constructor(readonly amount: number, readonly context: TContext) {}
}
