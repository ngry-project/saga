import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MessageHistory } from '../../core/client/message-history';

@Component({
  selector: 'ny-message-list-widget',
  templateUrl: './message-list-widget.component.html',
  styleUrls: ['./message-list-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageListWidgetComponent {
  constructor(readonly history: MessageHistory) {}
}
