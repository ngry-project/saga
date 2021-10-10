import { IEvent } from '@ngry/saga';

export class BalanceTopUpFailEvent implements IEvent {
  constructor(readonly amount: number, readonly context: unknown) {}
}
