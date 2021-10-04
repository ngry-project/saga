import { IEvent } from '../../../../src/lib/event/event';

export class BalanceTopUpFailEvent<TContext extends object = object> implements IEvent<TContext> {
  constructor(
    readonly amount: number,
    readonly context: TContext,
  ) {
  }
}
