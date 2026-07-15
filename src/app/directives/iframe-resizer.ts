import { AfterViewInit, Directive, ElementRef, OnDestroy, inject, input } from '@angular/core';
import { HeightCalculationMethod, IFrameComponent, iframeResizer } from 'iframe-resizer';

@Directive({
  selector: 'iframe[appIframeResizer]',
})
export class IFrameResizer implements AfterViewInit, OnDestroy {
  private readonly element = inject(ElementRef<HTMLIFrameElement>);

  readonly heightCalculationMethod = input<HeightCalculationMethod>('lowestElement');
  readonly scrolling = input(false);

  private component?: IFrameComponent[];

  ngAfterViewInit() {
    const components = iframeResizer(
      {
        checkOrigin: false,
        heightCalculationMethod: this.heightCalculationMethod(),
        scrolling: this.scrolling() ? 'auto' : false,
        log: false,
        autoResize: true,
        // interval: -1,
      },
      this.element.nativeElement as string | HTMLIFrameElement,
    );

    /* save component references so we can close them later */
    this.component = components;
    for (const component of components) {
      if (component.iFrameResizer) {
        component.iFrameResizer.resize();
      }
    }
  }

  ngOnDestroy(): void {
    if (this.component) {
      for (const component of this.component) {
        if (component.iFrameResizer) {
          component.iFrameResizer.close();
        }
      }
    }
  }
}
