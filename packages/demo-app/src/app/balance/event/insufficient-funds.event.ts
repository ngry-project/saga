import { IEvent } from '@ngry/saga';

export class InsufficientFundsEvent<TContext extends object = object>
  implements IEvent<TContext>
{
  constructor(
    readonly insufficientAmount: number,
    readonly context: TContext
  ) {}
}
