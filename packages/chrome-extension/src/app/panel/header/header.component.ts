import { Observable } from 'rxjs';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DevtoolsClient } from '../../core/client/devtools-client';

@Component({
  selector: 'ny-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  readonly ready$: Observable<boolean>;

  constructor(private readonly devtools: DevtoolsClient) {
    this.ready$ = this.devtools.ready$;
  }
}
