import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { PanelModule } from './panel/panel.module';
import { PanelComponent } from './panel/panel.component';

@NgModule({
  imports: [BrowserModule, CommonModule, PanelModule],
  bootstrap: [PanelComponent],
})
export class AppModule {}
