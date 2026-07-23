import { OverlayModule } from '@angular/cdk/overlay';
import { Component, computed, effect, signal, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ColumnResize } from '../../directives/column-resize';
import { ELEMENT_DATA } from '../../interfaces/data';
import { FilterState } from '../../interfaces/filter-state';
import { PeriodicElement } from '../../interfaces/periodic-element';
import { ColumnSelect } from './column-select/column-select';
import { Filter } from './filter/filter';
import { PeriodicElementDetail } from './periodic-element-detail/periodic-element-detail';

export const FULL_LIST_OF_COLUMNS = [
  'name',
  'appearance',
  'atomic_mass',
  'boil',
  'category',
  'density',
  'discovered_by',
  'melt',
  'molar_heat',
  'named_by',
  'number',
  'period',
  'group',
  'phase',
  'bohr_model_image',
  'bohr_model_3d',
  'spectral_img',
  'summary',
  'symbol',
  'xpos',
  'ypos',
  'wxpos',
  'wypos',
  'shells',
  'electron_configuration',
  'electron_configuration_semantic',
  'electron_affinity',
  'electronegativity_pauling',
  'ionization_energies',
  'image',
  'block',
];

export const DEFAULT_COLUMNS = [
  'name',
  'atomic_mass',
  'symbol',
  'number',
  'category',
  'period',
  'group',
  'phase',
  'source',
  'electron_configuration',
  'electron_configuration_semantic',
  'block',
];

export const DEFAULT_COLUMN_WIDTH = 150;
export const EXPAND_COLUMN_WIDTH = 56;
export const RESIZE_SPACER_COLUMN = 'resizeSpacer';

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
    OverlayModule,
    PeriodicElementDetail,
  ],
  templateUrl: './mat-table.html',
  styleUrl: './mat-table.scss',
})
export class MatTable {
  private readonly emptyFilterState: FilterState = { name: '' };
  private cachedFilterString = JSON.stringify(this.emptyFilterState);
  private cachedFilterState = this.emptyFilterState;

  readonly paginator = viewChild(MatPaginator);
  readonly sort = viewChild(MatSort);

  readonly dataSource = new MatTableDataSource(ELEMENT_DATA.elements);
  readonly columnsToDisplay = signal<string[]>(DEFAULT_COLUMNS);
  readonly columnsToDisplayWithExpand = computed(() => [...this.columnsToDisplay(), 'expand']);
  // A trailing flexible spacer column absorbs any slack so the resizable columns
  // always render at their exact specified widths (never proportionally redistributed
  // by the fixed table layout), which keeps drag resizing stable when the table has
  // fewer columns than fill the viewport.
  readonly columnsToRender = computed(() => [
    ...this.columnsToDisplayWithExpand(),
    RESIZE_SPACER_COLUMN,
  ]);
  readonly tableWidth = computed(() => {
    const widths = this.columnWidths();
    const dataTotal = this.columnsToDisplay().reduce(
      (total, column) => total + (widths[column] ?? DEFAULT_COLUMN_WIDTH),
      0,
    );

    return dataTotal + EXPAND_COLUMN_WIDTH;
  });
  readonly resizeSpacerColumn = RESIZE_SPACER_COLUMN;
  readonly fullListOfColumns = FULL_LIST_OF_COLUMNS;
  readonly defaultColumns = DEFAULT_COLUMNS;
  readonly expandedElement = signal<PeriodicElement | null>(null);
  readonly isOpen = signal(false);
  readonly columnWidths = signal<Record<string, number>>({});
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

  columnWidth(column: string): number {
    return this.columnWidths()[column] ?? DEFAULT_COLUMN_WIDTH;
  }

  setColumnWidth(column: string, width: number): void {
    this.columnWidths.update((widths) => ({ ...widths, [column]: width }));
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
