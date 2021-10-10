import { merge, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { IEvent } from '../event/event';
import { EventBus } from '../event/event-bus';
import { ICommand } from '../command/command';
import { CommandBus } from '../command/command-bus';

/**
 * Represents a testing bus.
 * Testing bus makes it easy to track sequences of commands and events.
 */
@Injectable({
  providedIn: 'root',
})
export class TestingBus {
  /**
   * Gets a combined stream of commands and events.
   */
  readonly sequence$: Observable<ICommand | IEvent>;

  constructor(private readonly commandBus: CommandBus, private readonly eventBus: EventBus) {
    this.sequence$ = merge(this.commandBus.commands$, this.eventBus.events$);
  }

  /**
   * Publishes an event through {@link EventBus}.
   */
  publish(event: IEvent): Promise<void> {
    return this.eventBus.publish(event);
  }

  /**
   * Executes a command through {@link CommandBus}.
   */
  execute(command: ICommand): Promise<void> {
    return this.commandBus.execute(command);
  }
}
