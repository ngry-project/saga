import { IEvent } from '../event/event';
import { IFlow } from './flow';

/**
 * Represents a flow event.
 * Flow events are being handled as a part of specific flow.
 * Flow events may be additionally filtered using {@link ofFlow} operator.
 * @see ofFlow
 */
export interface IFlowEvent<TFlow extends IFlow = IFlow> extends IEvent {
  /**
   * Gets a flow this event is a part of.
   */
  readonly flow: TFlow;
}
