import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';
import { ColumnResize } from './column-resize';

@Component({
  selector: 'app-host',
  imports: [ColumnResize],
  template: `<th
    [appColumnResize]="column()"
    [minWidth]="minWidth()"
    [maxWidth]="maxWidth()"
    (widthChange)="onWidth($event)"
  >
    Header
  </th>`,
})
class HostComponent {
  readonly column = signal('name');
  readonly minWidth = signal(60);
  readonly maxWidth = signal(1000);
  readonly widths: number[] = [];

  onWidth(width: number): void {
    this.widths.push(width);
  }
}

function setOffsetWidth(element: HTMLElement, value: number): void {
  Object.defineProperty(element, 'offsetWidth', { configurable: true, value });
}

describe('ColumnResize', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let th: HTMLElement;
  let handle: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();

    th = fixture.debugElement.query(By.css('th')).nativeElement as HTMLElement;
    handle = fixture.debugElement.query(By.css('.column-resize-handle'))
      .nativeElement as HTMLElement;
  });

  it('creates an accessible resize handle inside the host cell', () => {
    expect(handle).toBeTruthy();
    expect(handle.getAttribute('role')).toBe('separator');
    expect(handle.getAttribute('aria-orientation')).toBe('vertical');
    expect(handle.getAttribute('aria-label')).toBe('Resize name column');
    expect(handle.getAttribute('tabindex')).toBe('0');
    expect(th.style.position).toBe('relative');
  });

  it('initializes required separator value attributes on the handle', () => {
    expect(handle.getAttribute('aria-valuenow')).not.toBeNull();
    expect(handle.getAttribute('aria-valuemin')).toBe('60');
    expect(handle.getAttribute('aria-valuemax')).toBe('1000');
  });

  it('widens the column and emits width on ArrowRight', () => {
    setOffsetWidth(th, 200);

    handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));

    expect(host.widths.at(-1)).toBe(216);
    expect(handle.getAttribute('aria-valuenow')).toBe('216');
  });

  it('narrows the column and emits width on ArrowLeft', () => {
    setOffsetWidth(th, 200);

    handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));

    expect(host.widths.at(-1)).toBe(184);
  });

  it('clamps keyboard resizing to the minimum width', () => {
    setOffsetWidth(th, 64);

    handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));

    expect(host.widths.at(-1)).toBe(60);
  });

  it('clamps keyboard resizing to the maximum width', () => {
    host.maxWidth.set(210);
    fixture.detectChanges();
    setOffsetWidth(th, 200);

    handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));

    expect(host.widths.at(-1)).toBe(210);
    expect(handle.getAttribute('aria-valuenow')).toBe('210');
  });

  it('ignores non-arrow keys', () => {
    setOffsetWidth(th, 200);

    handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    expect(host.widths).toHaveLength(0);
  });

  it('emits a new width while dragging the handle', () => {
    setOffsetWidth(th, 150);

    handle.dispatchEvent(new MouseEvent('pointerdown', { clientX: 300, bubbles: true }));
    document.dispatchEvent(new MouseEvent('pointermove', { clientX: 380, bubbles: true }));

    expect(host.widths.at(-1)).toBe(230);
  });

  it('clamps drag resizing to the minimum width', () => {
    setOffsetWidth(th, 150);

    handle.dispatchEvent(new MouseEvent('pointerdown', { clientX: 300, bubbles: true }));
    document.dispatchEvent(new MouseEvent('pointermove', { clientX: 0, bubbles: true }));

    expect(host.widths.at(-1)).toBe(60);
  });

  it('clamps drag resizing to the maximum width', () => {
    host.maxWidth.set(400);
    fixture.detectChanges();
    setOffsetWidth(th, 150);

    handle.dispatchEvent(new MouseEvent('pointerdown', { clientX: 300, bubbles: true }));
    document.dispatchEvent(new MouseEvent('pointermove', { clientX: 900, bubbles: true }));

    expect(host.widths.at(-1)).toBe(400);
  });

  it('stops tracking pointer movement after release', () => {
    setOffsetWidth(th, 150);

    handle.dispatchEvent(new MouseEvent('pointerdown', { clientX: 300, bubbles: true }));
    document.dispatchEvent(new MouseEvent('pointerup', { bubbles: true }));
    const emitCount = host.widths.length;

    document.dispatchEvent(new MouseEvent('pointermove', { clientX: 500, bubbles: true }));

    expect(host.widths).toHaveLength(emitCount);
  });

  it('stops tracking pointer movement after pointercancel', () => {
    setOffsetWidth(th, 150);

    handle.dispatchEvent(new MouseEvent('pointerdown', { clientX: 300, bubbles: true }));
    document.dispatchEvent(new MouseEvent('pointercancel', { bubbles: true }));
    const emitCount = host.widths.length;

    document.dispatchEvent(new MouseEvent('pointermove', { clientX: 500, bubbles: true }));

    expect(host.widths).toHaveLength(emitCount);
  });

  it('does not leak listeners when a new drag starts before release', () => {
    setOffsetWidth(th, 150);

    // First drag never receives pointerup, then a second drag begins.
    handle.dispatchEvent(new MouseEvent('pointerdown', { clientX: 300, bubbles: true }));
    handle.dispatchEvent(new MouseEvent('pointerdown', { clientX: 300, bubbles: true }));
    document.dispatchEvent(new MouseEvent('pointermove', { clientX: 340, bubbles: true }));

    // Only the second drag's listener should fire (one emit for the move), not two.
    expect(host.widths).toEqual([190]);
  });

  it('does not emit again when the clamped width is unchanged', () => {
    setOffsetWidth(th, 150);

    handle.dispatchEvent(new MouseEvent('pointerdown', { clientX: 300, bubbles: true }));
    document.dispatchEvent(new MouseEvent('pointermove', { clientX: 400, bubbles: true }));
    document.dispatchEvent(new MouseEvent('pointermove', { clientX: 400, bubbles: true }));

    expect(host.widths).toEqual([250]);
  });

  it('does not repeatedly emit while held against the minimum width', () => {
    setOffsetWidth(th, 150);

    handle.dispatchEvent(new MouseEvent('pointerdown', { clientX: 300, bubbles: true }));
    document.dispatchEvent(new MouseEvent('pointermove', { clientX: 0, bubbles: true }));
    document.dispatchEvent(new MouseEvent('pointermove', { clientX: -50, bubbles: true }));

    expect(host.widths).toEqual([60]);
  });

  it('does not let handle clicks bubble to the header (avoids sorting)', () => {
    const parentClick = vi.fn();
    th.addEventListener('click', parentClick);

    handle.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(parentClick).not.toHaveBeenCalled();
  });

  it('sets the aria-label from the column at initialization', () => {
    host.column.set('symbol');
    fixture.detectChanges();

    expect(handle.getAttribute('aria-label')).toBe('Resize name column');
  });

  it('removes handle listeners on destroy', () => {
    setOffsetWidth(th, 150);
    fixture.destroy();

    handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));

    expect(host.widths).toHaveLength(0);
  });
});
