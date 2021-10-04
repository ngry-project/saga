import { IEvent } from '../../../../src/lib/event/event';

export class InsufficientFundsEvent<TContext extends object = object> implements IEvent<TContext> {
  constructor(
    readonly insufficientAmount: number,
    readonly context: TContext,
  ) {
  }
}
