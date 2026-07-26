import { OverlayModule } from '@angular/cdk/overlay';
import { NgOptimizedImage } from '@angular/common';
import { Component, computed, effect, inject, signal, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ColumnResize } from '../../directives/column-resize';
import { ColumnDefinition } from '../../interfaces/column-definition';
import { EXPAND_COLUMN_WIDTH, RESIZE_SPACER_COLUMN } from '../../interfaces/columns';
import { ELEMENT_DATA } from '../../interfaces/data';
import { FilterState } from '../../interfaces/filter-state';
import { PeriodicElement } from '../../interfaces/periodic-element';
import { AppState } from '../../services/app-state';
import { ColumnSelect } from './column-select/column-select';
import { Filter } from './filter/filter';
import { PeriodicElementDetail } from './periodic-element-detail/periodic-element-detail';

@Component({
  selector: 'app-mat-table',
  imports: [
    ColumnResize,
    ColumnSelect,
    Filter,
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
  private readonly emptyFilterState: FilterState = { name: '' };
  private cachedFilterString = JSON.stringify(this.emptyFilterState);
  private cachedFilterState = this.emptyFilterState;

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

  constructor() {
    this.dataSource.filterPredicate = (data: PeriodicElement, filter: string) => {
      const filterState = this.getCachedFilterState(filter);

      return data.name.toLowerCase().startsWith(filterState.name.toLowerCase());
    };
    this.dataSource.filter = JSON.stringify(this.emptyFilterState);
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
    this.dataSource.filter = JSON.stringify(event);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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
      return this.emptyFilterState;
    }

    try {
      const parsedFilter = JSON.parse(filter) as unknown;

      if (
        typeof parsedFilter === 'object' &&
        parsedFilter !== null &&
        'name' in parsedFilter &&
        typeof parsedFilter.name === 'string'
      ) {
        return { name: parsedFilter.name };
      }
    } catch (error) {
      if (!(error instanceof SyntaxError)) {
        throw error;
      }
    }

    return this.emptyFilterState;
  }
}
