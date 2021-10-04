import { ICommand } from '../command/command';
import { IFlow } from './flow';

/**
 * Represents a flow command.
 * Flow commands are being executed as a part of specific flow.
 * Flow commands may be additionally filtered using {@link ofFlow} operator.
 * @see ofFlow
 */
export interface IFlowCommand<TFlow extends IFlow = IFlow> extends ICommand {
  /**
   * Gets a flow this command is a part of.
   */
  readonly flow: TFlow;
}
