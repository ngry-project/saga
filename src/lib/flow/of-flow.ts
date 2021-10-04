import { OperatorFunction } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Type } from '@angular/core';
import { IFlow } from './flow';
import { IFlowEvent } from './flow-event';
import { IFlowCommand } from './flow-command';

type IFlowPart<TFlow extends IFlow = IFlow> = IFlowEvent<TFlow> | IFlowCommand<TFlow>;

/**
 * Selects flow events or commands which are part of specific flow.
 * @param type Type of flow
 */
export function ofFlow<TPart extends IFlowPart>(
  type: Type<TPart extends IFlowPart<infer TFlow> ? TFlow : never>,
): OperatorFunction<TPart, TPart> {
  return source$ => {
    return source$.pipe(
      filter((part): part is TPart => part.flow instanceof type),
    );
  };
}
