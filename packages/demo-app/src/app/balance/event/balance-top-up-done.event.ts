import { IEvent } from '@ngry/saga';

export class BalanceTopUpDoneEvent implements IEvent {
  constructor(readonly amount: number, readonly context: unknown) {}
}
