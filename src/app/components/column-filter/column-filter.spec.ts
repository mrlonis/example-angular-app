import { CdkTrapFocus } from '@angular/cdk/a11y';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSelect } from '@angular/material/select';
import { By } from '@angular/platform-browser';
import { ColumnDefinition } from '../../interfaces/column-definition';
import { ColumnFilter } from './column-filter';

const PHASE_COLUMN: ColumnDefinition = {
  name: 'phase',
  displayName: 'Phase',
  isSortable: true,
  isFilterable: true,
  width: 150,
};

describe('ColumnFilter', () => {
  let component: ColumnFilter;
  let fixture: ComponentFixture<ColumnFilter>;
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;

  function trigger(): HTMLButtonElement {
    return fixture.debugElement.query(By.css('button.column-filter-trigger'))
      .nativeElement as HTMLButtonElement;
  }

  function openOverlay(): void {
    trigger().click();
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColumnFilter],
    }).compileComponents();

    overlayContainer = TestBed.inject(OverlayContainer);
    overlayContainerElement = overlayContainer.getContainerElement();
    fixture = TestBed.createComponent(ColumnFilter);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('column', PHASE_COLUMN);
    fixture.componentRef.setInput('options', ['Gas', 'Liquid', 'Solid']);
    fixture.componentRef.setInput('selectedValues', []);
    fixture.detectChanges();
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Trigger', () => {
    it('keeps the overlay closed until the trigger is used', () => {
      expect(component.isOpen()).toBeFalsy();
      expect(overlayContainerElement.querySelector('.column-filter-card')).toBeNull();
      expect(trigger().getAttribute('aria-expanded')).toBe('false');
    });

    it('opens and closes the overlay from the trigger', () => {
      openOverlay();

      expect(component.isOpen()).toBeTruthy();
      expect(overlayContainerElement.querySelector('.column-filter-card')).toBeTruthy();
      expect(trigger().getAttribute('aria-expanded')).toBe('true');

      trigger().click();
      fixture.detectChanges();

      expect(component.isOpen()).toBeFalsy();
      expect(overlayContainerElement.querySelector('.column-filter-card')).toBeNull();
    });

    it('closes the overlay when the backdrop is clicked', () => {
      openOverlay();

      const backdrop = overlayContainerElement.querySelector('.cdk-overlay-backdrop');
      expect(backdrop).toBeTruthy();
      (backdrop as HTMLElement).click();
      fixture.detectChanges();

      expect(component.isOpen()).toBeFalsy();
    });

    it('labels the trigger with the column it filters', () => {
      expect(trigger().getAttribute('aria-label')).toBe('Filter Phase column');
      expect(trigger().getAttribute('data-testid')).toBe('column-filter-trigger-phase');
    });

    it('announces that the trigger opens a dialog', () => {
      expect(trigger().getAttribute('aria-haspopup')).toBe('dialog');
    });

    it('reports the number of selected values in the trigger label', () => {
      fixture.componentRef.setInput('selectedValues', ['Gas', 'Solid']);
      fixture.detectChanges();

      expect(trigger().getAttribute('aria-label')).toBe('Filter Phase column, 2 selected');
    });

    it('marks the trigger as active only while values are selected', () => {
      expect(trigger().classList).not.toContain('column-filter-trigger-active');

      fixture.componentRef.setInput('selectedValues', ['Gas']);
      fixture.detectChanges();

      expect(component.hasSelection()).toBeTruthy();
      expect(trigger().classList).toContain('column-filter-trigger-active');
    });

    it('hides the icon from assistive technology', () => {
      const icon = fixture.debugElement.query(By.css('button.column-filter-trigger mat-icon'));

      expect(icon.attributes['aria-hidden']).toBe('true');
      expect(icon.attributes['fontIcon']).toBe('filter_alt');
    });
  });

  describe('Overlay content', () => {
    it('renders a card holding a multiple select of the offered options', () => {
      openOverlay();

      const select = fixture.debugElement.query(By.directive(MatSelect))
        .componentInstance as MatSelect;
      select.open();
      fixture.detectChanges();
      const options = overlayContainerElement.querySelectorAll('mat-option');

      expect(overlayContainerElement.querySelector('mat-card.column-filter-card')).toBeTruthy();
      expect(select.multiple).toBeTruthy();
      expect([...options].map((option) => option.textContent?.trim())).toEqual([
        'Gas',
        'Liquid',
        'Solid',
      ]);
    });

    it('labels the select with the column display name', () => {
      openOverlay();

      expect(overlayContainerElement.querySelector('mat-label')?.textContent?.trim()).toBe('Phase');
    });

    it('exposes the card as a labelled modal dialog', () => {
      openOverlay();

      const card = overlayContainerElement.querySelector('mat-card.column-filter-card');

      expect(card?.getAttribute('role')).toBe('dialog');
      expect(card?.getAttribute('aria-modal')).toBe('true');
      expect(card?.getAttribute('aria-label')).toBe('Filter Phase column');
    });

    it('keeps the dialog label free of the selection count carried by the trigger', () => {
      fixture.componentRef.setInput('selectedValues', ['Gas']);
      openOverlay();

      expect(component.dialogLabel()).toBe('Filter Phase column');
      expect(component.triggerLabel()).toBe('Filter Phase column, 1 selected');
    });

    it('shows the current selection in the select', () => {
      fixture.componentRef.setInput('selectedValues', ['Liquid']);
      openOverlay();

      const select = fixture.debugElement.query(By.directive(MatSelect))
        .componentInstance as MatSelect;

      expect(select.value).toEqual(['Liquid']);
    });

    it('emits the picked values when the select changes', () => {
      const emitted: string[][] = [];
      component.selectedValues.subscribe((values) => emitted.push(values));
      openOverlay();

      const select = fixture.debugElement.query(By.directive(MatSelect));
      select.triggerEventHandler('valueChange', ['Gas', 'Solid']);

      expect(emitted).toEqual([['Gas', 'Solid']]);
      expect(component.selectedValues()).toEqual(['Gas', 'Solid']);
    });

    it('clears the selection from the clear button', () => {
      fixture.componentRef.setInput('selectedValues', ['Gas']);
      openOverlay();

      const clearButton = [...overlayContainerElement.querySelectorAll('button')].find((button) =>
        button.textContent?.includes('Clear filter'),
      );
      expect(clearButton?.disabled).toBeFalsy();
      clearButton?.click();

      expect(component.selectedValues()).toEqual([]);
    });

    it('disables the clear button while nothing is selected', () => {
      openOverlay();

      const clearButton = [...overlayContainerElement.querySelectorAll('button')].find((button) =>
        button.textContent?.includes('Clear filter'),
      );

      expect(clearButton?.disabled).toBeTruthy();
    });

    it('closes the overlay when escape is pressed inside the card', () => {
      openOverlay();

      const card = overlayContainerElement.querySelector('mat-card.column-filter-card');
      card?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      fixture.detectChanges();

      expect(component.isOpen()).toBeFalsy();
    });

    it('traps focus in the overlay and returns it to the trigger when it closes', () => {
      openOverlay();

      // The trap only moves focus when the browser reports element geometry, which jsdom does not
      // do, so the wiring is asserted here and the focus behaviour is covered by the e2e suite.
      const trap = fixture.debugElement.query(By.directive(CdkTrapFocus));

      expect(trap).toBeTruthy();
      expect(trap.injector.get(CdkTrapFocus).autoCapture).toBeTruthy();
    });
  });
});
