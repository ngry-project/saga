import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HighlightModule } from 'ngx-highlightjs';
import { ViewportModule } from '../core/component/viewport/viewport.module';
import { MessageListWidgetComponent } from './message-list-widget/message-list-widget.component';
import { SagaListWidgetComponent } from './saga-list-widget/saga-list-widget.component';
import { SagaListComponent } from './saga-list-widget/saga-list/saga-list.component';
import { SagaItemComponent } from './saga-list-widget/saga-list/saga-item/saga-item.component';
import { HeaderModule } from './header/header.module';
import { PanelComponent } from './panel.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot([
      {
        path: 'message-list',
        component: MessageListWidgetComponent,
      },
      {
        path: 'saga-list',
        component: SagaListWidgetComponent,
      },
      {
        path: '**',
        redirectTo: 'saga-list',
      },
    ]),
    HeaderModule,
    ViewportModule,
    HighlightModule,
  ],
  declarations: [
    PanelComponent,
    MessageListWidgetComponent,
    SagaListWidgetComponent,
    SagaListComponent,
    SagaItemComponent,
  ],
  exports: [PanelComponent],
})
export class PanelModule {}
