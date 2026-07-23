import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  OnDestroy,
  Renderer2,
  inject,
  input,
  output,
} from '@angular/core';

const KEYBOARD_STEP = 16;

@Directive({
  selector: '[appColumnResize]',
})
export class ColumnResize implements AfterViewInit, OnDestroy {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly document = inject(DOCUMENT);

  readonly column = input.required<string>({ alias: 'appColumnResize' });
  readonly minWidth = input(60);
  readonly maxWidth = input(1000);

  readonly widthChange = output<number>();

  private handle?: HTMLElement;
  private startX = 0;
  private startWidth = 0;
  private readonly cleanups: (() => void)[] = [];
  private readonly pointerCleanups: (() => void)[] = [];

  ngAfterViewInit(): void {
    const host = this.element.nativeElement;
    this.renderer.setStyle(host, 'position', 'relative');

    const handle = this.renderer.createElement('span') as HTMLElement;
    this.renderer.addClass(handle, 'column-resize-handle');
    this.renderer.setAttribute(handle, 'role', 'separator');
    this.renderer.setAttribute(handle, 'aria-orientation', 'vertical');
    this.renderer.setAttribute(handle, 'aria-label', `Resize ${this.column()} column`);
    this.renderer.setAttribute(handle, 'aria-valuemin', `${this.minWidth()}`);
    this.renderer.setAttribute(handle, 'aria-valuemax', `${this.maxWidth()}`);
    this.renderer.setAttribute(handle, 'aria-valuenow', `${this.clampWidth(host.offsetWidth)}`);
    this.renderer.setAttribute(handle, 'tabindex', '0');
    this.renderer.appendChild(host, handle);
    this.handle = handle;

    this.cleanups.push(
      this.renderer.listen(handle, 'pointerdown', (event: PointerEvent) => {
        this.onPointerDown(event);
      }),
      this.renderer.listen(handle, 'keydown', (event: KeyboardEvent) => {
        this.onKeyDown(event);
      }),
      this.renderer.listen(handle, 'click', (event: MouseEvent) => {
        event.stopPropagation();
      }),
    );
  }

  ngOnDestroy(): void {
    this.releasePointer();
    for (const cleanup of this.cleanups) {
      cleanup();
    }
  }

  private onPointerDown(event: PointerEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.startX = event.clientX;
    this.startWidth = this.element.nativeElement.offsetWidth;

    this.pointerCleanups.push(
      this.renderer.listen(this.document, 'pointermove', (moveEvent: PointerEvent) => {
        this.onPointerMove(moveEvent);
      }),
      this.renderer.listen(this.document, 'pointerup', () => {
        this.releasePointer();
      }),
    );

    this.handle?.setPointerCapture?.(event.pointerId);
  }

  private onPointerMove(event: PointerEvent): void {
    this.applyWidth(this.startWidth + (event.clientX - this.startX));
  }

  private releasePointer(): void {
    while (this.pointerCleanups.length > 0) {
      const cleanup = this.pointerCleanups.pop();
      cleanup?.();
    }
  }

  private onKeyDown(event: KeyboardEvent): void {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const delta = event.key === 'ArrowRight' ? KEYBOARD_STEP : -KEYBOARD_STEP;
    this.applyWidth(this.element.nativeElement.offsetWidth + delta);
  }

  private clampWidth(width: number): number {
    return Math.round(Math.min(this.maxWidth(), Math.max(this.minWidth(), width)));
  }

  private applyWidth(width: number): void {
    const clamped = this.clampWidth(width);
    this.handle?.setAttribute('aria-valuenow', `${clamped}`);
    this.widthChange.emit(clamped);
  }
}
