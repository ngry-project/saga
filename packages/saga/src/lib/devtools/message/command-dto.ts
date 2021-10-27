import { CommandMetadata } from '../../command/command-metadata';
import { ICommand } from '../../command/command';

export interface CommandDto {
  readonly type: 'command';
  readonly name: string;
  readonly metadata: CommandMetadata | undefined;
  readonly payload: ICommand;
}
