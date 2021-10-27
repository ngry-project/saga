import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewportComponent } from './viewport.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ViewportComponent],
  exports: [ViewportComponent],
})
export class ViewportModule {}
