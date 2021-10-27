import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DevtoolsClient } from '../core/client/devtools-client';
import { MessageHistory } from '../core/client/message-history';

@Component({
  selector: 'ny-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelComponent {
  constructor(private readonly devtools: DevtoolsClient, private readonly messageHistory: MessageHistory) {
    this.devtools.ready$.subscribe(() => {
      this.messageHistory.reset();
    });

    this.devtools.messages$.subscribe((message) => {
      this.messageHistory.add(message);
    });
  }
}
