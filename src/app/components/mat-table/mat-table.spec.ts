import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';
import { FilterState } from '../../interfaces/filter-state';
import { ColumnSelect } from './column-select/column-select';
import { DEFAULT_COLUMNS, FULL_LIST_OF_COLUMNS, MatTable } from './mat-table';

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

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('initializes displayed columns to DEFAULT_COLUMNS', () => {
      expect(component.columnsToDisplay()).toEqual(DEFAULT_COLUMNS);
    });

    it('creates columnsToDisplayWithExpand by appending expand column', () => {
      expect(component.columnsToDisplayWithExpand()).toEqual([...DEFAULT_COLUMNS, 'expand']);
    });

    it('exposes fullListOfColumns constant', () => {
      expect(component.fullListOfColumns).toBe(FULL_LIST_OF_COLUMNS);
    });

    it('exposes defaultColumns constant', () => {
      expect(component.defaultColumns).toBe(DEFAULT_COLUMNS);
    });

    it('initializes expandedElement to null', () => {
      expect(component.expandedElement()).toBeNull();
    });
  });

  describe('DataSource Initialization', () => {
    it('initializes dataSource with ELEMENT_DATA.elements', () => {
      expect(component.dataSource.data).toBeDefined();
      expect(component.dataSource.data.length).toBeGreaterThan(0);
    });

    it('connects paginator to data source through effect', () => {
      expect(component.dataSource.paginator).toBe(component.paginator());
    });

    it('connects sort to data source through effect', () => {
      expect(component.dataSource.sort).toBe(component.sort());
    });
  });

  describe('Column Management', () => {
    it('setColumnsToDisplay updates columnsToDisplay signal', () => {
      const newColumns = ['name', 'symbol'];
      component.setColumnsToDisplay(newColumns);
      expect(component.columnsToDisplay()).toEqual(newColumns);
    });

    it('columnsToDisplayWithExpand updates when columnsToDisplay changes', () => {
      const newColumns = ['name', 'symbol', 'atomic_mass'];
      component.setColumnsToDisplay(newColumns);
      expect(component.columnsToDisplayWithExpand()).toEqual([...newColumns, 'expand']);
    });

    it('setColumnsToDisplay can handle empty array', () => {
      component.setColumnsToDisplay([]);
      expect(component.columnsToDisplay()).toEqual([]);
      expect(component.columnsToDisplayWithExpand()).toEqual(['expand']);
    });

    it('setColumnsToDisplay can handle all columns from fullListOfColumns', () => {
      component.setColumnsToDisplay(FULL_LIST_OF_COLUMNS);
      expect(component.columnsToDisplay()).toEqual(FULL_LIST_OF_COLUMNS);
    });

    it('setColumnsToDisplay can reset to DEFAULT_COLUMNS', () => {
      component.setColumnsToDisplay(['name', 'symbol']);
      expect(component.columnsToDisplay()).not.toEqual(DEFAULT_COLUMNS);

      component.setColumnsToDisplay(DEFAULT_COLUMNS);
      expect(component.columnsToDisplay()).toEqual(DEFAULT_COLUMNS);
    });
  });

  describe('Filtering', () => {
    it('initializes dataSource filter to an empty serialized filter state', () => {
      expect(component.dataSource.filter).toBe(JSON.stringify({ name: '' }));
    });

    it('applies serialized filter state to dataSource', () => {
      const filterState: FilterState = { name: 'helium' };
      component.applyFilter(filterState);
      expect(component.dataSource.filter).toBe(JSON.stringify(filterState));
    });

    it('applies filter without pagination if paginator is absent', () => {
      component.dataSource.paginator = null;
      const filterState: FilterState = { name: 'hydrogen' };
      component.applyFilter(filterState);
      expect(component.dataSource.filter).toBe(JSON.stringify(filterState));
    });

    it('resets to first page when filtering with active paginator', () => {
      const paginator = component.paginator();
      expect(paginator).toBeTruthy();
      if (!paginator) {
        throw new Error('Expected paginator to be available');
      }
      const firstPageSpy = vi.spyOn(paginator, 'firstPage');

      component.applyFilter({ name: 'h' });

      expect(firstPageSpy).toHaveBeenCalledTimes(1);
    });

    it('handles empty filter string', () => {
      component.applyFilter({ name: '' });
      expect(component.dataSource.filter).toBe(JSON.stringify({ name: '' }));
    });

    it('handles filter with special characters', () => {
      component.applyFilter({ name: 'au*' });
      expect(component.dataSource.filter).toBe(JSON.stringify({ name: 'au*' }));
    });

    it('handles filter with numbers', () => {
      component.applyFilter({ name: '79' });
      expect(component.dataSource.filter).toBe(JSON.stringify({ name: '79' }));
    });

    it('filters names using case-insensitive startsWith predicate', () => {
      component.applyFilter({ name: 'heL' });
      const filteredNames = component.dataSource.filteredData.map(({ name }) => name);

      expect(filteredNames.length).toBeGreaterThan(0);
      expect(filteredNames.every((name) => name.toLowerCase().startsWith('hel'))).toBeTruthy();
    });

    it('falls back to empty filter state when filter string is empty', () => {
      component.dataSource.filter = '';

      expect(component.dataSource.filteredData).toHaveLength(component.dataSource.data.length);
    });

    it('falls back to empty filter state when filter string is invalid JSON', () => {
      component.dataSource.filter = 'not-json';

      expect(component.dataSource.filteredData).toHaveLength(component.dataSource.data.length);
    });

    it('caches parsed filter state for repeated predicate evaluations with same filter', () => {
      const parseSpy = vi.spyOn(JSON, 'parse');
      const element = component.dataSource.data[0];
      const filter = JSON.stringify({ name: 'he' });

      component.dataSource.filterPredicate(element, filter);
      component.dataSource.filterPredicate(element, filter);
      component.dataSource.filterPredicate(element, filter);

      expect(parseSpy).toHaveBeenCalledTimes(1);
      parseSpy.mockRestore();
    });
  });

  describe('Expand/Collapse Functionality', () => {
    it('toggleExpanded sets expandedElement to element when null', () => {
      const element = component.dataSource.data[0];
      expect(component.expandedElement()).toBeNull();

      component.toggleExpanded(new MouseEvent('click'), element);
      expect(component.expandedElement()).toBe(element);
    });

    it('toggleExpanded clears expandedElement when same element is toggled', () => {
      const element = component.dataSource.data[0];
      component.toggleExpanded(new MouseEvent('click'), element);
      expect(component.expandedElement()).toBe(element);

      component.toggleExpanded(new MouseEvent('click'), element);
      expect(component.expandedElement()).toBeNull();
    });

    it('toggleExpanded replaces expandedElement when different element is toggled', () => {
      const element1 = component.dataSource.data[0];
      const element2 = component.dataSource.data[1];

      component.toggleExpanded(new MouseEvent('click'), element1);
      expect(component.expandedElement()).toBe(element1);

      component.toggleExpanded(new MouseEvent('click'), element2);
      expect(component.expandedElement()).toBe(element2);
    });

    it('toggleExpanded ignores keyboard keys other than Enter and Space', () => {
      const element = component.dataSource.data[0];

      component.toggleExpanded(new KeyboardEvent('keydown', { key: 'Escape' }), element);

      expect(component.expandedElement()).toBeNull();
    });

    it('toggleExpanded expands row when Enter is pressed', () => {
      const element = component.dataSource.data[0];

      component.toggleExpanded(new KeyboardEvent('keydown', { key: 'Enter' }), element);

      expect(component.expandedElement()).toBe(element);
    });

    it('toggleExpanded ignores bubbled keyboard events from child elements', () => {
      const element = component.dataSource.data[0];
      const row = document.createElement('tr');
      const button = document.createElement('button');
      row.append(button);
      row.addEventListener('keydown', (event) => component.toggleExpanded(event, element));

      button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

      expect(component.expandedElement()).toBeNull();
    });

    it('toggleExpanded prevents default when Space is pressed', () => {
      const element = component.dataSource.data[0];
      const keyboardEvent = new KeyboardEvent('keydown', { key: ' ', cancelable: true });
      const preventDefaultSpy = vi.spyOn(keyboardEvent, 'preventDefault');

      component.toggleExpanded(keyboardEvent, element);

      expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
      expect(component.expandedElement()).toBe(element);
    });

    it('isExpanded returns true when element is expanded', () => {
      const element = component.dataSource.data[0];
      component.toggleExpanded(new MouseEvent('click'), element);
      expect(component.isExpanded(element)).toBe(true);
    });

    it('isExpanded returns false when element is not expanded', () => {
      const element = component.dataSource.data[0];
      expect(component.isExpanded(element)).toBe(false);

      component.toggleExpanded(new MouseEvent('click'), element);
      expect(component.isExpanded(element)).toBe(true);

      component.toggleExpanded(new MouseEvent('click'), element);
      expect(component.isExpanded(element)).toBe(false);
    });

    it('isExpanded returns false for different elements when one is expanded', () => {
      const element1 = component.dataSource.data[0];
      const element2 = component.dataSource.data[1];

      component.toggleExpanded(new MouseEvent('click'), element1);
      expect(component.isExpanded(element1)).toBe(true);
      expect(component.isExpanded(element2)).toBe(false);
    });
  });

  describe('Template Integration - Column Select', () => {
    it('renders app-column-select component', () => {
      const columnSelect = fixture.debugElement.query(By.css('app-column-select'));
      expect(columnSelect).toBeTruthy();
    });

    it('passes fullListOfColumns to column-select', () => {
      const columnSelect = fixture.debugElement.query(By.css('app-column-select'));
      expect((columnSelect.componentInstance as ColumnSelect).fullListOfColumns()).toEqual(
        FULL_LIST_OF_COLUMNS,
      );
    });

    it('passes columnsToDisplay to column-select', () => {
      const columnSelect = fixture.debugElement.query(By.css('app-column-select'));
      expect((columnSelect.componentInstance as ColumnSelect).columnsToDisplay()).toEqual(
        DEFAULT_COLUMNS,
      );
    });

    it('updates columnsToDisplay when column-select emits columnsToDisplayChange', () => {
      const columnSelect = fixture.debugElement.query(By.css('app-column-select'));
      const newColumns = ['name', 'symbol', 'atomic_mass'];

      columnSelect.triggerEventHandler('columnsToDisplayChange', newColumns);
      fixture.detectChanges();

      expect(component.columnsToDisplay()).toEqual(newColumns);
    });

    it('column-select reflects current columnsToDisplay selection', () => {
      const newColumns = ['name', 'symbol'];
      component.setColumnsToDisplay(newColumns);
      fixture.detectChanges();

      const columnSelect = fixture.debugElement.query(By.css('app-column-select'));
      expect((columnSelect.componentInstance as ColumnSelect).columnsToDisplay()).toEqual(
        newColumns,
      );
    });
  });

  describe('Template Integration - Table Headers and Footers', () => {
    it('renders table header for each column in columnsToDisplayWithExpand', () => {
      const headers = fixture.debugElement.queryAll(By.css('th[mat-header-cell]'));
      expect(headers.length).toBe(component.columnsToDisplayWithExpand().length);
    });

    it('renders table footer with total element count', () => {
      const footerCells = Array.from(
        (fixture.nativeElement as HTMLElement).querySelectorAll('td.mat-mdc-footer-cell'),
        (cell: Element) => cell.textContent?.trim(),
      );

      const elementCount = component.dataSource.data.length;
      expect(footerCells).toContain('Total # of elements:');
      expect(footerCells).toContain(`${elementCount}`);
    });

    it('footer cell count matches dataSource data length', () => {
      const host = fixture.nativeElement as HTMLElement;
      const countCell = Array.from(host.querySelectorAll('td.mat-mdc-footer-cell')).find((cell) =>
        cell.textContent?.includes(component.dataSource.data.length.toString()),
      );

      expect(countCell).toBeTruthy();
    });
  });

  describe('Template Integration - Expand/Collapse Buttons', () => {
    it('renders expand buttons for each paginated row', () => {
      const expandButtons = fixture.debugElement.queryAll(
        By.css('button[aria-label="expand row"]'),
      );
      // Table has pagination with default page size of 25
      expect(expandButtons.length).toBe(component.paginator()?.pageSize ?? 25);
    });

    it('displays keyboard_arrow_down icon when row is not expanded', () => {
      const expandButton = fixture.debugElement.query(By.css('button[aria-label="expand row"]'));
      expect((expandButton.nativeElement as HTMLElement).textContent).toContain(
        'keyboard_arrow_down',
      );
    });

    it('displays keyboard_arrow_up icon when row is expanded', () => {
      const element = component.dataSource.data[0];
      const expandButton = fixture.debugElement.query(By.css('button[aria-label="expand row"]'));

      component.toggleExpanded(new MouseEvent('click'), element);
      fixture.detectChanges();

      expect((expandButton.nativeElement as HTMLElement).textContent).toContain(
        'keyboard_arrow_up',
      );
    });

    it('toggles expand state when expand button is clicked', () => {
      const element = component.dataSource.data[0];
      const expandButton = fixture.debugElement.query(By.css('button[aria-label="expand row"]'));

      expandButton.triggerEventHandler('click', new MouseEvent('click'));
      fixture.detectChanges();
      expect(component.isExpanded(element)).toBe(true);

      expandButton.triggerEventHandler('click', new MouseEvent('click'));
      fixture.detectChanges();
      expect(component.isExpanded(element)).toBe(false);
    });

    it('button click stops event propagation', () => {
      const expandButton = fixture.debugElement.query(By.css('button[aria-label="expand row"]'));
      const mouseEvent = new MouseEvent('click');
      const stopPropagationSpy = vi.spyOn(mouseEvent, 'stopPropagation');

      (expandButton.nativeElement as HTMLElement).dispatchEvent(mouseEvent);
      fixture.detectChanges();

      expect(stopPropagationSpy).toHaveBeenCalled();
    });
  });

  describe('Template Integration - Row Interactions', () => {
    it('renders table rows for each paginated element', () => {
      const rows = fixture.debugElement.queryAll(By.css('tr.example-element-row'));
      // Table has pagination with default page size of 25
      expect(rows.length).toBe(component.paginator()?.pageSize ?? 25);
    });

    it('toggles expand when clicking on a row', () => {
      const element = component.dataSource.data[0];
      const row = fixture.debugElement.query(By.css('tr.example-element-row'));

      row.triggerEventHandler('click', new MouseEvent('click'));
      fixture.detectChanges();
      expect(component.isExpanded(element)).toBe(true);

      row.triggerEventHandler('click', new MouseEvent('click'));
      fixture.detectChanges();
      expect(component.isExpanded(element)).toBe(false);
    });

    it('applies example-expanded-row class when row is expanded', () => {
      const element = component.dataSource.data[0];
      let row = fixture.debugElement.query(By.css('tr.example-element-row'));
      expect((row.nativeElement as HTMLElement).classList.contains('example-expanded-row')).toBe(
        false,
      );

      component.toggleExpanded(new MouseEvent('click'), element);
      fixture.detectChanges();

      row = fixture.debugElement.query(By.css('tr.example-element-row'));
      expect((row.nativeElement as HTMLElement).classList.contains('example-expanded-row')).toBe(
        true,
      );
    });

    it('removes example-expanded-row class when row is collapsed', () => {
      const element = component.dataSource.data[0];
      component.toggleExpanded(new MouseEvent('click'), element);
      fixture.detectChanges();

      let row = fixture.debugElement.query(By.css('tr.example-expanded-row'));
      expect(row).toBeTruthy();

      component.toggleExpanded(new MouseEvent('click'), element);
      fixture.detectChanges();

      row = fixture.debugElement.query(By.css('tr.example-expanded-row'));
      expect(row).toBeFalsy();
    });
  });

  describe('Template Integration - Filter', () => {
    it('renders app-filter component', () => {
      const filter = fixture.debugElement.query(By.css('app-filter'));
      expect(filter).toBeTruthy();
    });

    it('calls applyFilter when app-filter emits valueChange', () => {
      const filter = fixture.debugElement.query(By.css('app-filter'));
      const spy = vi.spyOn(component, 'applyFilter');
      const filterState: FilterState = { name: 'test' };

      filter.triggerEventHandler('valueChange', filterState);
      expect(spy).toHaveBeenCalledWith(filterState);
    });
  });

  describe('Mat Paginator Integration', () => {
    it('renders mat-paginator element', () => {
      const paginator = fixture.debugElement.query(By.css('mat-paginator'));
      expect(paginator).toBeTruthy();
    });

    it('paginator has correct pageSize', () => {
      const paginatorComponent = component.paginator();
      expect(paginatorComponent?.pageSize).toBe(25);
    });

    it('paginator has correct pageSizeOptions', () => {
      const paginatorComponent = component.paginator();
      expect(paginatorComponent?.pageSizeOptions).toEqual([5, 10, 25, 50, 100]);
    });

    it('paginator is connected to data source', () => {
      expect(component.dataSource.paginator).toBe(component.paginator());
    });
  });

  describe('Mat Sort Integration', () => {
    it('renders sortable table headers', () => {
      const sortHeaders = fixture.debugElement.queryAll(By.css('[mat-sort-header]'));
      expect(sortHeaders.length).toBeGreaterThan(0);
    });

    it('sort is connected to data source', () => {
      expect(component.dataSource.sort).toBe(component.sort());
    });

    it('sort headers correspond to displayed columns', () => {
      const sortHeaders = fixture.debugElement.queryAll(By.css('[mat-sort-header]'));
      const sortHeaderTexts = sortHeaders.map((header) =>
        ((header.nativeElement as HTMLElement).textContent ?? '').trim().toLowerCase(),
      );

      const displayedColumns = component.columnsToDisplay().map((col) => col.toLowerCase());
      sortHeaderTexts.forEach((text) => {
        expect(displayedColumns).toContain(text);
      });
    });
  });

  describe('Dynamic Column Changes', () => {
    it('table updates when columnsToDisplay changes', () => {
      const initialHeaders = fixture.debugElement.queryAll(By.css('th[mat-header-cell]'));
      const initialCount = initialHeaders.length;

      component.setColumnsToDisplay(['name', 'symbol']);
      fixture.detectChanges();

      const updatedHeaders = fixture.debugElement.queryAll(By.css('th[mat-header-cell]'));
      expect(updatedHeaders.length).not.toBe(initialCount);
      expect(updatedHeaders.length).toBe(3); // name, symbol, expand
    });

    it('expandedDetail row maintains proper colspan after column change', () => {
      component.setColumnsToDisplay(['name', 'symbol']);
      fixture.detectChanges();

      // Find the detail row cell with the example-element-detail-wrapper
      const detailRow = fixture.debugElement.query(
        By.css('td[mat-cell] .example-element-detail-wrapper'),
      );
      const colspan = (detailRow?.nativeElement as HTMLElement).parentElement?.getAttribute(
        'colspan',
      );
      expect(colspan).toBe(component.columnsToDisplayWithExpand().length.toString());
    });
  });

  describe('Edge Cases', () => {
    it('handles toggling expand with no data', () => {
      // Even with data, ensure toggle works correctly
      const firstElement = component.dataSource.data[0];
      expect(() => {
        component.toggleExpanded(new MouseEvent('click'), firstElement);
      }).not.toThrow();
    });

    it('handles filtering with special characters in search', () => {
      expect(() => {
        component.applyFilter({ name: '!@#$%' });
      }).not.toThrow();
    });

    it('handles rapid column changes', () => {
      expect(() => {
        component.setColumnsToDisplay(['name']);
        component.setColumnsToDisplay(['symbol']);
        component.setColumnsToDisplay(['atomic_mass']);
        component.setColumnsToDisplay(DEFAULT_COLUMNS);
      }).not.toThrow();

      expect(component.columnsToDisplay()).toEqual(DEFAULT_COLUMNS);
    });

    it('handles multiple expand toggles on same element', () => {
      const element = component.dataSource.data[0];
      for (let i = 0; i < 5; i++) {
        component.toggleExpanded(new MouseEvent('click'), element);
      }
      // After odd number of toggles, should be expanded
      expect(component.isExpanded(element)).toBe(true);

      component.toggleExpanded(new MouseEvent('click'), element);
      expect(component.isExpanded(element)).toBe(false);
    });
  });
});
