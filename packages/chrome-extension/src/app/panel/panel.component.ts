import { Observable } from 'rxjs';
import { filter, scan, startWith, switchMap, tap } from 'rxjs/operators';
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

  readonly ready$: Observable<boolean>;
  readonly messages$: Observable<Message[]>;

  constructor(private readonly devtools: DevtoolsClient, private readonly changeDetectorRef: ChangeDetectorRef) {
    this.ready$ = devtools.ready$.pipe(tap(() => setTimeout(() => this.changeDetectorRef.detectChanges())));

    this.messages$ = this.devtools.ready$.pipe(
      filter(Boolean),
      switchMap(() => {
        return this.devtools.messages$.pipe(
          scan((messages: Message[], message: Message) => [...messages, message], []),
          startWith([]),
          tap(() => setTimeout(() => this.changeDetectorRef.detectChanges())),
        );
      }),
    );
  }
}
