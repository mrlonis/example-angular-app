import { OverlayModule } from '@angular/cdk/overlay';
import { NgOptimizedImage } from '@angular/common';
import { Component, computed, effect, signal, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ColumnResize } from '../../directives/column-resize';
import { ColumnDefinition } from '../../interfaces/column-definition';
import { ELEMENT_DATA } from '../../interfaces/data';
import { FilterState } from '../../interfaces/filter-state';
import { PeriodicElement } from '../../interfaces/periodic-element';
import { ColumnSelect } from './column-select/column-select';
import { Filter } from './filter/filter';
import { PeriodicElementDetail } from './periodic-element-detail/periodic-element-detail';

export const DEFAULT_COLUMN_WIDTH = 150;
export const EXPAND_COLUMN_WIDTH = 56;
export const RESIZE_SPACER_COLUMN = 'resizeSpacer';

// Every column starts at DEFAULT_COLUMN_WIDTH for now; the explicit per-column
// `width` makes it easy to tune each one to an appropriate value later.
export const FULL_LIST_OF_COLUMNS: ColumnDefinition[] = [
  { name: 'name', displayName: 'Name', isSortable: true, width: DEFAULT_COLUMN_WIDTH },
  { name: 'appearance', displayName: 'Appearance', isSortable: true, width: DEFAULT_COLUMN_WIDTH },
  {
    name: 'atomic_mass',
    displayName: 'Atomic Mass',
    isSortable: true,
    width: DEFAULT_COLUMN_WIDTH,
  },
  { name: 'boil', displayName: 'Boiling Point', isSortable: true, width: DEFAULT_COLUMN_WIDTH },
  { name: 'category', displayName: 'Category', isSortable: true, width: DEFAULT_COLUMN_WIDTH },
  { name: 'density', displayName: 'Density', isSortable: true, width: DEFAULT_COLUMN_WIDTH },
  {
    name: 'discovered_by',
    displayName: 'Discovered By',
    isSortable: true,
    width: DEFAULT_COLUMN_WIDTH,
  },
  { name: 'melt', displayName: 'Melting Point', isSortable: true, width: DEFAULT_COLUMN_WIDTH },
  { name: 'molar_heat', displayName: 'Molar Heat', isSortable: true, width: DEFAULT_COLUMN_WIDTH },
  { name: 'named_by', displayName: 'Named By', isSortable: true, width: DEFAULT_COLUMN_WIDTH },
  { name: 'number', displayName: 'Number', isSortable: true, width: DEFAULT_COLUMN_WIDTH },
  { name: 'period', displayName: 'Period', isSortable: true, width: DEFAULT_COLUMN_WIDTH },
  { name: 'group', displayName: 'Group', isSortable: true, width: DEFAULT_COLUMN_WIDTH },
  { name: 'phase', displayName: 'Phase', isSortable: true, width: DEFAULT_COLUMN_WIDTH },
  {
    name: 'bohr_model_image',
    displayName: 'Bohr Model Image',
    isSortable: false,
    width: DEFAULT_COLUMN_WIDTH,
  },
  {
    name: 'bohr_model_3d',
    displayName: 'Bohr Model 3D',
    isSortable: false,
    width: DEFAULT_COLUMN_WIDTH,
  },
  {
    name: 'spectral_img',
    displayName: 'Spectral Image',
    isSortable: false,
    width: DEFAULT_COLUMN_WIDTH,
  },
  { name: 'summary', displayName: 'Summary', isSortable: true, width: DEFAULT_COLUMN_WIDTH },
  { name: 'symbol', displayName: 'Symbol', isSortable: true, width: DEFAULT_COLUMN_WIDTH },
  { name: 'xpos', displayName: 'X Position', isSortable: true, width: DEFAULT_COLUMN_WIDTH },
  { name: 'ypos', displayName: 'Y Position', isSortable: true, width: DEFAULT_COLUMN_WIDTH },
  { name: 'wxpos', displayName: 'Wide X Position', isSortable: true, width: DEFAULT_COLUMN_WIDTH },
  { name: 'wypos', displayName: 'Wide Y Position', isSortable: true, width: DEFAULT_COLUMN_WIDTH },
  { name: 'shells', displayName: 'Shells', isSortable: true, width: DEFAULT_COLUMN_WIDTH },
  {
    name: 'electron_configuration',
    displayName: 'Electron Configuration',
    isSortable: true,
    width: DEFAULT_COLUMN_WIDTH,
  },
  {
    name: 'electron_configuration_semantic',
    displayName: 'Electron Configuration (Semantic)',
    isSortable: true,
    width: DEFAULT_COLUMN_WIDTH,
  },
  {
    name: 'electron_affinity',
    displayName: 'Electron Affinity',
    isSortable: true,
    width: DEFAULT_COLUMN_WIDTH,
  },
  {
    name: 'electronegativity_pauling',
    displayName: 'Electronegativity (Pauling)',
    isSortable: true,
    width: DEFAULT_COLUMN_WIDTH,
  },
  {
    name: 'ionization_energies',
    displayName: 'Ionization Energies',
    isSortable: true,
    width: DEFAULT_COLUMN_WIDTH,
  },
  { name: 'image', displayName: 'Image', isSortable: false, width: DEFAULT_COLUMN_WIDTH },
  { name: 'block', displayName: 'Block', isSortable: true, width: DEFAULT_COLUMN_WIDTH },
];

const COLUMN_DEFINITIONS_BY_NAME = new Map<string, ColumnDefinition>(
  FULL_LIST_OF_COLUMNS.map((column) => [column.name, column]),
);

function requireColumn(name: string): ColumnDefinition {
  const column = COLUMN_DEFINITIONS_BY_NAME.get(name);

  if (!column) {
    throw new Error(`Unknown column definition: ${name}`);
  }

  return column;
}

// `source` is shown by default but intentionally omitted from the column
// chooser's full list, so it isn't part of FULL_LIST_OF_COLUMNS.
const SOURCE_COLUMN: ColumnDefinition = {
  name: 'source',
  displayName: 'Source',
  isSortable: false,
  width: DEFAULT_COLUMN_WIDTH,
};

export const DEFAULT_COLUMNS: ColumnDefinition[] = [
  requireColumn('name'),
  requireColumn('atomic_mass'),
  requireColumn('symbol'),
  requireColumn('number'),
  requireColumn('category'),
  requireColumn('period'),
  requireColumn('group'),
  requireColumn('phase'),
  SOURCE_COLUMN,
  requireColumn('electron_configuration'),
  requireColumn('electron_configuration_semantic'),
  requireColumn('block'),
];

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
  private readonly emptyFilterState: FilterState = { name: '' };
  private cachedFilterString = JSON.stringify(this.emptyFilterState);
  private cachedFilterState = this.emptyFilterState;

  readonly paginator = viewChild(MatPaginator);
  readonly sort = viewChild(MatSort);

  readonly dataSource = new MatTableDataSource(ELEMENT_DATA.elements);
  readonly columnsToDisplay = signal<ColumnDefinition[]>(DEFAULT_COLUMNS);
  readonly columnsToDisplayWithExpand = computed(() => [
    ...this.columnsToDisplay().map((column) => column.name),
    'expand',
  ]);
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
      (total, column) => total + (widths[column.name] ?? column.width),
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

  columnWidth(column: ColumnDefinition): number {
    return this.columnWidths()[column.name] ?? column.width;
  }

  imageAlt(element: PeriodicElement, column: ColumnDefinition): string {
    return `${element.name} ${column.displayName.toLowerCase()}`;
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
