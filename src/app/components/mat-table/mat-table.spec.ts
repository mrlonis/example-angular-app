import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';
import { MatTable, DEFAULT_COLUMNS } from './mat-table';

describe('MatTable', () => {
  let component: MatTable;
  let fixture: ComponentFixture<MatTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatTable],
    }).compileComponents();

    fixture = TestBed.createComponent(MatTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('initializes displayed columns and expands list correctly', () => {
    expect(component.columnsToDisplay()).toEqual(DEFAULT_COLUMNS);
    expect(component.columnsToDisplayWithExpand()).toEqual([...DEFAULT_COLUMNS, 'expand']);
  });

  it('connects paginator and sort to data source once view children are available', () => {
    expect(component.dataSource.paginator).toBe(component.paginator());
    expect(component.dataSource.sort).toBe(component.sort());
  });

  it('updates selected columns and falls back to defaults when null is provided', () => {
    component.setColumnsToDisplay(['name', 'symbol']);
    expect(component.columnsToDisplay()).toEqual(['name', 'symbol']);

    component.setColumnsToDisplay(null);
    expect(component.columnsToDisplay()).toEqual(DEFAULT_COLUMNS);
  });

  it('applies a normalized filter and does not paginate when paginator is absent', () => {
    component.dataSource.paginator = null;
    component.applyFilter({ target: { value: '  HeLIum  ' } } as unknown as Event);

    expect(component.dataSource.filter).toBe('helium');
  });

  it('moves to first page when filtering with an active paginator', () => {
    const paginator = component.paginator();
    expect(paginator).toBeTruthy();
    if (!paginator) {
      throw new Error('Expected paginator to be available');
    }
    const firstPage = vi.spyOn(paginator, 'firstPage');

    component.applyFilter({ target: { value: '  H  ' } } as unknown as Event);

    expect(firstPage).toHaveBeenCalledTimes(1);
    expect(component.dataSource.filter).toBe('h');
  });

  it('toggles expanded state and reports whether an element is expanded', () => {
    const element = component.dataSource.data[0];

    expect(component.isExpanded(element)).toBe(false);

    component.toggleExpanded(element);
    expect(component.isExpanded(element)).toBe(true);

    component.toggleExpanded(element);
    expect(component.isExpanded(element)).toBe(false);
  });

  it('updates columns from mat-select valueChange and renders up/down icons for expand state', () => {
    const matSelectDebug = fixture.debugElement.query(By.css('mat-select'));
    const element = component.dataSource.data[0];

    matSelectDebug.triggerEventHandler('valueChange', ['name', 'symbol']);
    fixture.detectChanges();
    expect(component.columnsToDisplay()).toEqual(['name', 'symbol']);

    const expandButton = fixture.debugElement.query(By.css('button[aria-label="expand row"]'));
    expandButton.triggerEventHandler('click', new MouseEvent('click'));
    fixture.detectChanges();
    expect(component.isExpanded(element)).toBe(true);
    expect((expandButton.nativeElement as HTMLElement).textContent).toContain('keyboard_arrow_up');

    expandButton.triggerEventHandler('click', new MouseEvent('click'));
    fixture.detectChanges();
    expect(component.isExpanded(element)).toBe(false);
    expect((expandButton.nativeElement as HTMLElement).textContent).toContain(
      'keyboard_arrow_down',
    );
  });

  it('renders expected footer summaries', () => {
    const host = fixture.nativeElement as HTMLElement;
    const footerCells = Array.from(
      host.querySelectorAll('td.mat-mdc-footer-cell'),
      (cell: Element) => cell.textContent?.trim(),
    );

    expect(footerCells).toContain('Total # of elements:');
    expect(footerCells).toContain(`${component.dataSource.data.length}`);
  });
});
