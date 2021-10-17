import { InjectionToken, Type } from '@angular/core';
import { ICommandHandler } from '../command/command-handler';
import { IEventHandler } from '../event/event-handler';
import { IEventPublisher } from '../event/event-publisher';
import { IEventListener } from '../event/event-listener';

export interface SagaFeatureOptions {
  sagas?: Array<Type<object>>;

  commands?: Array<Type<ICommandHandler>>;
  events?: Array<Type<IEventHandler>>;
  publishers?: Array<Type<IEventPublisher>>;
  listeners?: Array<Type<IEventListener>>;
}

export const SAGA_FEATURE_OPTIONS = new InjectionToken<SagaFeatureOptions>('SagaFeatureOptions');
