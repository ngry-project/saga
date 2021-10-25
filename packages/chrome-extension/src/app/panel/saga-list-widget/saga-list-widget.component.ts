import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MessageHistory } from '../../core/client/message-history';

@Component({
  selector: 'ny-saga-list-widget',
  templateUrl: './saga-list-widget.component.html',
  styleUrls: ['./saga-list-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SagaListWidgetComponent {
  constructor(readonly messageLogStore: MessageHistory) {}
}
