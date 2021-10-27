import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';
import { HIGHLIGHT_OPTIONS, HighlightModule } from 'ngx-highlightjs';
import { CachedRouteReuseStrategy } from './core/routing/cached-route-reuse-strategy';
import { PanelModule } from './panel/panel.module';
import { PanelComponent } from './panel/panel.component';

@NgModule({
  imports: [BrowserModule, BrowserAnimationsModule, CommonModule, PanelModule, HighlightModule],
  providers: [
    {
      provide: RouteReuseStrategy,
      useExisting: CachedRouteReuseStrategy,
    },
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        fullLibraryLoader: () => import('highlight.js'),
      },
    },
  ],
  bootstrap: [PanelComponent],
})
export class AppModule {}
