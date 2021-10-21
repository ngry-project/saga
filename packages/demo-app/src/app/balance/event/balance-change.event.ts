import { IEvent } from '@ngry/saga';

export class BalanceChangeEvent implements IEvent {
  constructor(readonly from: number, readonly to: number) {}
}
