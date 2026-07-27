import { OverlayModule } from '@angular/cdk/overlay';
import { NgOptimizedImage } from '@angular/common';
import { Component, computed, effect, inject, signal, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ColumnResize } from '../../directives/column-resize';
import { HeaderCellAction } from '../../directives/header-cell-action';
import { ColumnDefinition } from '../../interfaces/column-definition';
import { EXPAND_COLUMN_WIDTH, RESIZE_SPACER_COLUMN } from '../../interfaces/columns';
import { ELEMENT_DATA } from '../../interfaces/data';
import { EMPTY_FILTER_STATE, FilterState, NameFilter } from '../../interfaces/filter-state';
import { PeriodicElement } from '../../interfaces/periodic-element';
import { AppState } from '../../services/app-state';
import { ColumnFilter } from './column-filter/column-filter';
import { ColumnSelect } from './column-select/column-select';
import { Filter } from './filter/filter';
import { PeriodicElementDetail } from './periodic-element-detail/periodic-element-detail';

/**
 * Reads a column off an element as the string the header filters compare against. Columns holding
 * anything but a primitive (images, lists) have no meaningful filter value, so they read as blank.
 */
function readColumnValue(element: PeriodicElement, column: string): string {
  const value = (element as unknown as Record<string, unknown>)[column];

  if (typeof value === 'string') {
    return value;
  }

  return typeof value === 'number' || typeof value === 'boolean' ? String(value) : '';
}

@Component({
  selector: 'app-mat-table',
  imports: [
    ColumnFilter,
    ColumnResize,
    ColumnSelect,
    Filter,
    HeaderCellAction,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    NgOptimizedImage,
    OverlayModule,
    PeriodicElementDetail,
  ],
  templateUrl: './mat-table.html',
  styleUrl: './mat-table.scss',
})
export class MatTable {
  private readonly appState = inject(AppState);
  private cachedFilterString = JSON.stringify(EMPTY_FILTER_STATE);
  private cachedFilterState = EMPTY_FILTER_STATE;
  // The option list of a column never changes, so it is derived once and then reused. Returning the
  // same array on every read also keeps the `app-column-filter` input from churning.
  private readonly filterOptionsCache = new Map<string, string[]>();
  // Shared empty selection, so an unfiltered column always reads back the same array reference.
  private readonly noSelectedValues: string[] = [];

  readonly paginator = viewChild(MatPaginator);
  readonly sort = viewChild(MatSort);

  readonly dataSource = new MatTableDataSource(ELEMENT_DATA.elements);
  // Column selection and widths are owned by AppState so they survive a page reload.
  readonly columnsToDisplay = this.appState.columnsToDisplay;
  readonly fullListOfColumns = this.appState.fullListOfColumns;
  // A trailing flexible spacer column absorbs any slack so the resizable columns
  // always render at their exact specified widths (never proportionally redistributed
  // by the fixed table layout), which keeps drag resizing stable when the table has
  // fewer columns than fill the viewport.
  readonly columnsToRender = computed(() => [
    ...this.columnsToDisplay().map((column) => column.name),
    'expand',
    RESIZE_SPACER_COLUMN,
  ]);
  readonly tableWidth = computed(() => {
    const dataTotal = this.columnsToDisplay().reduce((total, column) => total + column.width, 0);

    return dataTotal + EXPAND_COLUMN_WIDTH;
  });
  readonly resizeSpacerColumn = RESIZE_SPACER_COLUMN;
  readonly expandedElement = signal<PeriodicElement | null>(null);
  readonly isOpen = signal(false);
  readonly expandColumnWidth = EXPAND_COLUMN_WIDTH;
  readonly filterState = signal<FilterState>(EMPTY_FILTER_STATE);

  constructor() {
    this.dataSource.filterPredicate = (data: PeriodicElement, filter: string) => {
      const filterState = this.getCachedFilterState(filter);

      if (!data.name.toLowerCase().startsWith(filterState.name.toLowerCase())) {
        return false;
      }

      return Object.entries(filterState.columnValues).every(
        ([column, values]) => values.length === 0 || values.includes(readColumnValue(data, column)),
      );
    };
    this.dataSource.filter = JSON.stringify(EMPTY_FILTER_STATE);
    effect(() => {
      const paginator = this.paginator();
      const sort = this.sort();

      if (paginator) {
        this.dataSource.paginator = paginator;
      }
      if (sort) {
        this.dataSource.sort = sort;
      }
    });
  }

  applyFilter(event: FilterState) {
    this.filterState.set(event);
    this.dataSource.filter = JSON.stringify(event);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /** Merges the free text search box value into the filter state, keeping the column filters. */
  applyNameFilter(event: NameFilter) {
    this.applyFilter({ ...this.filterState(), name: event.name });
  }

  /** Replaces the values selected for a single column; an empty selection drops the filter. */
  setColumnFilter(column: string, values: string[]) {
    const currentState = this.filterState();
    const columnValues = { ...currentState.columnValues };

    if (values.length === 0) {
      delete columnValues[column];
    } else {
      columnValues[column] = values;
    }

    this.applyFilter({ ...currentState, columnValues });
  }

  columnFilterValues(column: string): string[] {
    return this.filterState().columnValues[column] ?? this.noSelectedValues;
  }

  /** Every distinct value a column holds, in alphabetical order, offered as filter options. */
  columnFilterOptions(column: string): string[] {
    const cachedOptions = this.filterOptionsCache.get(column);

    if (cachedOptions) {
      return cachedOptions;
    }

    const values = new Set<string>();

    for (const element of this.dataSource.data) {
      const value = readColumnValue(element, column);

      if (value !== '') {
        values.add(value);
      }
    }

    const options = [...values].sort((a, b) => a.localeCompare(b));
    this.filterOptionsCache.set(column, options);

    return options;
  }

  toggleExpanded(event: Event, element: PeriodicElement) {
    if (event instanceof KeyboardEvent) {
      if (
        event.currentTarget instanceof HTMLElement &&
        event.target instanceof HTMLElement &&
        event.target !== event.currentTarget
      ) {
        return;
      }

      if (event.key !== 'Enter' && event.key !== ' ') {
        return;
      }
      if (event.key === ' ') {
        event.preventDefault();
      }
    }

    event.stopPropagation();
    this.expandedElement.update((current) => (current === element ? null : element));
  }

  isExpanded(element: PeriodicElement) {
    return this.expandedElement() === element;
  }

  imageAlt(element: PeriodicElement, column: ColumnDefinition): string {
    return `${element.name} ${column.displayName.toLowerCase()}`;
  }

  setColumnsToDisplay(columns: ColumnDefinition[]): void {
    this.appState.setColumnsToDisplay(columns);
  }

  setColumnWidth(column: string, width: number): void {
    this.appState.setColumnWidth(column, width);
  }

  private getCachedFilterState(filter: string): FilterState {
    if (filter === this.cachedFilterString) {
      return this.cachedFilterState;
    }

    const filterState = this.parseFilterState(filter);
    this.cachedFilterString = filter;
    this.cachedFilterState = filterState;

    return filterState;
  }

  private parseFilterState(filter: string): FilterState {
    if (!filter) {
      return EMPTY_FILTER_STATE;
    }

    try {
      const parsedFilter = JSON.parse(filter) as unknown;

      if (typeof parsedFilter === 'object' && parsedFilter !== null && 'name' in parsedFilter) {
        const { name } = parsedFilter;

        if (typeof name === 'string') {
          return {
            name,
            columnValues: this.parseColumnValues(
              'columnValues' in parsedFilter ? parsedFilter.columnValues : undefined,
            ),
          };
        }
      }
    } catch (error) {
      if (!(error instanceof SyntaxError)) {
        throw error;
      }
    }

    return EMPTY_FILTER_STATE;
  }

  private parseColumnValues(value: unknown): Record<string, string[]> {
    if (typeof value !== 'object' || value === null) {
      return {};
    }

    const columnValues: Record<string, string[]> = {};

    for (const [column, values] of Object.entries(value)) {
      if (Array.isArray(values)) {
        // Blank values are never offered as filter options, so accepting them here would build a
        // filter state the UI cannot reproduce and that hides every row with a populated cell.
        const stringValues = (values as unknown[]).filter(
          (entry): entry is string => typeof entry === 'string' && entry !== '',
        );

        if (stringValues.length > 0) {
          columnValues[column] = stringValues;
        }
      }
    }

    return columnValues;
  }
}
