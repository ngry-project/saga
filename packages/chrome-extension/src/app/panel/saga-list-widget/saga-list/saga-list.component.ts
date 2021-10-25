import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommandDto, EventDto } from '@ngry/saga';

@Component({
  selector: 'ny-saga-list',
  templateUrl: './saga-list.component.html',
  styleUrls: ['./saga-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SagaListComponent {
  @Input()
  events: ReadonlyArray<EventDto> = [];

  @Input()
  commands: ReadonlyArray<CommandDto> = [];

  @Input()
  entities: ReadonlyArray<EventDto | CommandDto> = [];
}
