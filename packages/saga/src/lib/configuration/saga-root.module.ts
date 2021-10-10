import { tap } from 'rxjs/operators';
import { NgModule } from '@angular/core';
import { CommandBus } from '../command/command-bus';
import { EventBus } from '../event/event-bus';
import { DevtoolsRemote } from '../devtools/devtools-remote';
import { CommandPublishedMessage } from '../devtools/message/command-published-message';
import { EventPublishedMessage } from '../devtools/message/event-published-message';

@NgModule()
export class SagaRootModule {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus,
    private readonly devtools: DevtoolsRemote,
  ) {
    this.commandBus.commands$
      .pipe(
        tap((command) => {
          this.devtools.send({
            type: 'COMMAND_PUBLISHED',
            command: {
              name: command.constructor.name,
              payload: command,
            },
          } as CommandPublishedMessage);
        }),
      )
      .subscribe();

    this.eventBus.events$
      .pipe(
        tap((event) => {
          this.devtools.send({
            type: 'EVENT_PUBLISHED',
            event: {
              name: event.constructor.name,
              payload: event,
            },
          } as EventPublishedMessage);
        }),
      )
      .subscribe();
  }
}
