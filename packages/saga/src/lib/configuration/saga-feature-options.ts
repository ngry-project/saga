import { InjectionToken, Type } from '@angular/core';
import { ICommandHandler } from '../command/command-handler';
import { IEventHandler } from '../event/event-handler';
import { IEventPublisher } from '../event/event-publisher';

export interface SagaFeatureOptions {
  commands?: Array<Type<ICommandHandler>>;
  events?: Array<Type<IEventHandler>>;
  sagas?: Array<Type<object>>;
  publishers?: Array<Type<IEventPublisher>>;
}

export const SAGA_FEATURE_OPTIONS = new InjectionToken<SagaFeatureOptions>('SagaFeatureOptions');
