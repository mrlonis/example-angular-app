import { AfterViewInit, Directive, ElementRef, Renderer2, inject } from '@angular/core';

/**
 * Places an interactive control directly inside its header cell (`th`) and keeps its interactions
 * from reaching the surrounding `mat-sort-header`.
 *
 * `MatSortHeader` projects everything inside the header cell into a `div[role="button"]`. A control
 * declared in the header template therefore ends up as a focusable descendant of a button, which is
 * an accessibility violation (nested interactive controls). Re-parenting the control to the header
 * cell makes it a sibling of the sort container instead, so the header keeps `aria-sort` on the
 * `th`, the sort button keeps its own semantics, and the control stays reachable on its own.
 *
 * The element node is only moved, never re-created, so Angular's bindings, outputs and view cleanup
 * keep working: Angular resolves the parent node at removal time.
 */
@Directive({
  selector: '[appHeaderCellAction]',
  host: {
    // The cell is the `mat-sort-header` host, which sorts on click and on Enter/Space, so events
    // coming from this control must stop before they get there.
    '(click)': 'stopEvent($event)',
    '(keydown)': 'stopEvent($event)',
  },
})
export class HeaderCellAction implements AfterViewInit {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);

  ngAfterViewInit(): void {
    const host = this.element.nativeElement;
    const headerCell = host.closest('th');

    if (headerCell && host.parentElement !== headerCell) {
      this.renderer.appendChild(headerCell, host);
    }
  }

  stopEvent(event: Event): void {
    event.stopPropagation();
  }
}
