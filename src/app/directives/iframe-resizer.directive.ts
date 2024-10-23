import { AfterViewInit, Directive, ElementRef, Input, OnDestroy } from '@angular/core';
import { HeightCalculationMethod, IFrameComponent, iframeResizer } from 'iframe-resizer';

@Directive({
  standalone: true,
  selector: '[appIframeResizer]',
})
export class IFrameResizerDirective implements AfterViewInit, OnDestroy {
  @Input() heightCalculationMethod: HeightCalculationMethod = 'lowestElement';
  @Input() scrolling = false;

  component: IFrameComponent | null = null;

  constructor(public element: ElementRef) {}

  ngAfterViewInit() {
    const components = iframeResizer(
      {
        checkOrigin: false,
        heightCalculationMethod: this.heightCalculationMethod,
        scrolling: this.scrolling ? 'auto' : false,
        log: false,
        autoResize: true,
        // interval: -1,
      },
      this.element.nativeElement as string | HTMLElement,
    );

    /* save component reference so we can close it later */
    this.component = components.length > 0 ? components[0] : null;
    if (this.component?.iFrameResizer) {
      this.component.iFrameResizer.resize();
    }
  }

  ngOnDestroy(): void {
    if (this.component?.iFrameResizer) {
      this.component.iFrameResizer.close();
    }
  }
}
