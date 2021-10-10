import { ICommand } from '@ngry/saga';

export class BalanceTopUpCommand implements ICommand {
  constructor(readonly initialAmount: number, readonly context: unknown) {}
}
