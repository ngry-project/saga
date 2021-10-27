import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommandDto, EventDto } from '@ngry/saga';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'ny-saga-item',
  templateUrl: './saga-item.component.html',
  styleUrls: ['./saga-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('highlight', [
      state(
        'void',
        style({
          boxShadow: 'dodgerblue 0 0 0 4px',
        }),
      ),
      state(
        'ready',
        style({
          boxShadow: '',
        }),
      ),
      transition('void => ready', [animate('1s 2s')]),
    ]),
  ],
})
export class SagaItemComponent {
  @Input()
  entity!: EventDto | CommandDto;

  @Input()
  entities: ReadonlyArray<EventDto | CommandDto> = [];

  @Input()
  events: ReadonlyArray<EventDto> = [];

  @Input()
  commands: ReadonlyArray<CommandDto> = [];
}
