import { IEvent } from '@ngry/saga';

export class InsufficientFundsEvent implements IEvent {
  constructor(readonly insufficientAmount: number, readonly context: unknown) {}
}
