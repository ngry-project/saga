import { Injectable } from '@angular/core';
import { MemoryStateContainer, Store } from '@ngry/store';
import { CommandDto, CommandPublishedMessage, EventDto, EventPublishedMessage, Message } from '@ngry/saga';
import { MessageHistoryState } from './message-history-state';

@Injectable({
  providedIn: 'root',
})
export class MessageHistory extends Store<MessageHistoryState> {
  constructor() {
    super(
      new MemoryStateContainer<MessageHistoryState>({
        messages: [],
        commands: [],
        events: [],
        entities: [],
      }),
    );
  }

  add(message: Message) {
    let command: CommandDto | undefined;

    if (message.type === 'COMMAND_PUBLISHED') {
      command = (message as CommandPublishedMessage).command;
    }

    let event: EventDto | undefined;

    if (message.type === 'EVENT_PUBLISHED') {
      event = (message as EventPublishedMessage).event;
    }

    this.patchState((state) => {
      const commands = command ? [...state.commands, command] : state.commands;
      const events = event ? [...state.events, event] : state.events;
      const entities =
        event || command ? [...state.entities, (event || command) as EventDto | CommandDto] : state.entities;

      return { messages: [...state.messages, message], events, commands, entities };
    });
  }

  reset() {
    this.resetState();
  }
}
