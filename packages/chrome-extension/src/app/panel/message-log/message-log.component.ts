import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Message } from '@ngry/saga';

@Component({
  selector: 'ny-message-log',
  templateUrl: './message-log.component.html',
  styleUrls: ['./message-log.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageLogComponent {
  @Input()
  messages: Array<Message> = [];
}
