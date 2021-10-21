import { CommandDto, EventDto, Message } from '@ngry/saga';

export interface MessageHistoryState {
  readonly messages: ReadonlyArray<Message>;
  readonly commands: ReadonlyArray<CommandDto>;
  readonly events: ReadonlyArray<EventDto>;
  readonly entities: ReadonlyArray<CommandDto | EventDto>;
}
