import { tap } from 'rxjs/operators';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { Message } from '@ngry/saga';
import { DevtoolsClient } from '../core/client/devtools-client';

@Component({
  selector: 'ny-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelComponent {
  @Input()
  target: 'panel' | 'tooltip' = 'panel';

  messages: Message[] = [];

  constructor(
    private readonly devtools: DevtoolsClient,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {
    this.devtools.messages$
      .pipe(
        tap((message) => {
          this.messages.push(message);
          this.changeDetectorRef.detectChanges();
        }),
      )
      .subscribe();
  }
}
