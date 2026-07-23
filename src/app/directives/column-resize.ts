import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  OnDestroy,
  Renderer2,
  effect,
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
  private lastEmittedWidth?: number;
  private readonly cleanups: (() => void)[] = [];
  private readonly pointerCleanups: (() => void)[] = [];

  constructor() {
    // Keep the separator's label and range attributes in sync with the inputs.
    // If the column or bounds change at runtime, refresh aria-label/valuemin/valuemax
    // and re-clamp an already-resized column so the emitted width can't contradict
    // the range.
    effect(() => {
      const column = this.column();
      const min = this.minWidth();
      const max = this.maxWidth();
      const handle = this.handle;

      if (!handle) {
        return;
      }

      handle.setAttribute('aria-label', `Resize ${column} column`);
      handle.setAttribute('aria-valuemin', `${min}`);
      handle.setAttribute('aria-valuemax', `${max}`);

      if (this.lastEmittedWidth !== undefined) {
        this.applyWidth(this.lastEmittedWidth);
      }
    });
  }

  ngAfterViewInit(): void {
    const host = this.element.nativeElement;
    // Only establish a positioning context when the cell isn't already positioned,
    // so we don't override Material's sticky header (position: sticky).
    if (this.document.defaultView?.getComputedStyle(host).position === 'static') {
      this.renderer.setStyle(host, 'position', 'relative');
    }

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
    // Only the primary (left) button starts a resize; let secondary buttons
    // (e.g. right-click) fall through so the context menu behaves normally.
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    // Clear any listeners from a prior drag that never received pointerup
    // (e.g. a second pointerdown before release) to avoid leaks/duplicate emits.
    this.releasePointer();

    this.startX = event.clientX;
    this.startWidth = this.element.nativeElement.offsetWidth;

    this.pointerCleanups.push(
      this.renderer.listen(this.document, 'pointermove', (moveEvent: PointerEvent) => {
        this.onPointerMove(moveEvent);
      }),
      this.renderer.listen(this.document, 'pointerup', () => {
        this.releasePointer();
      }),
      this.renderer.listen(this.document, 'pointercancel', () => {
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

    if (clamped === this.lastEmittedWidth) {
      return;
    }

    this.lastEmittedWidth = clamped;
    this.handle?.setAttribute('aria-valuenow', `${clamped}`);
    this.widthChange.emit(clamped);
  }
}
