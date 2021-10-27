import { tap } from 'rxjs/operators';
import { NgModule } from '@angular/core';
import { CommandBus } from '../command/command-bus';
import { EventBus } from '../event/event-bus';
import { Devtools } from '../devtools/devtools';
import { CommandPublishedMessage } from '../devtools/message/command-published-message';
import { EventPublishedMessage } from '../devtools/message/event-published-message';
import { CommandRepository } from '../command/command-repository';
import { EventRepository } from '../event/event-repository';

@NgModule()
export class SagaRootModule {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly commandRepository: CommandRepository,
    private readonly eventBus: EventBus,
    private readonly eventRepository: EventRepository,
    private readonly devtools: Devtools,
  ) {
    this.commandBus.commands$
      .pipe(
        tap((command) => {
          const message: CommandPublishedMessage = {
            type: 'COMMAND_PUBLISHED',
            command: {
              type: 'command',
              name: command.constructor.name,
              metadata: this.commandRepository.getMetadata(command),
              payload: command,
            },
          };

          this.devtools.send(message);
        }),
      )
      .subscribe();

    this.eventBus.events$
      .pipe(
        tap((event) => {
          const message: EventPublishedMessage = {
            type: 'EVENT_PUBLISHED',
            event: {
              type: 'event',
              name: event.constructor.name,
              metadata: this.eventRepository.getMetadata(event),
              payload: event,
            },
          };

          this.devtools.send(message);
        }),
      )
      .subscribe();
  }
}
