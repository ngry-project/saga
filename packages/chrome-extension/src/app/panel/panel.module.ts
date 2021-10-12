import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelComponent } from './panel.component';
import { MessageLogComponent } from './message-log/message-log.component';

@NgModule({
  imports: [CommonModule],
  declarations: [PanelComponent, MessageLogComponent],
  exports: [PanelComponent],
})
export class PanelModule {}
