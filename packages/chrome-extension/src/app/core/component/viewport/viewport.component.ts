import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Inject, OnDestroy, Output } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'ny-viewport',
  templateUrl: './viewport.component.html',
  styleUrls: ['./viewport.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewportComponent implements OnDestroy {
  private observer?: ResizeObserver;

  @Output()
  readonly sizeChange = new EventEmitter<ResizeObserverEntry[]>();

  constructor(
    @Inject(DOCUMENT)
    private readonly document: Document,
    private readonly elementRef: ElementRef<HTMLElement>,
  ) {
    const window = document.defaultView;

    if (window) {
      this.observer = new window.ResizeObserver((entries) => {
        this.sizeChange.emit(entries);
      });

      this.observer.observe(elementRef.nativeElement);
    }
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
