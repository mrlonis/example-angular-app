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

// Most columns use DEFAULT_COLUMN_WIDTH, with a few tuned to wider values where
// their content warrants it. The explicit per-column `width` makes it easy to
// adjust any column to an appropriate value.
export const NAME_COLUMN: ColumnDefinition = {
  name: 'name',
  displayName: 'Name',
  isSortable: true,
  width: DEFAULT_COLUMN_WIDTH,
};

export const APPEARANCE_COLUMN: ColumnDefinition = {
  name: 'appearance',
  displayName: 'Appearance',
  isSortable: true,
  width: DEFAULT_COLUMN_WIDTH,
};

export const ATOMIC_MASS_COLUMN: ColumnDefinition = {
  name: 'atomic_mass',
  displayName: 'Atomic Mass',
  isSortable: true,
  width: DEFAULT_COLUMN_WIDTH,
};

export const BOIL_COLUMN: ColumnDefinition = {
  name: 'boil',
  displayName: 'Boiling Point',
  isSortable: true,
  width: DEFAULT_COLUMN_WIDTH,
};

export const CATEGORY_COLUMN: ColumnDefinition = {
  name: 'category',
  displayName: 'Category',
  isSortable: true,
  width: 200,
};

export const DENSITY_COLUMN: ColumnDefinition = {
  name: 'density',
  displayName: 'Density',
  isSortable: true,
  width: DEFAULT_COLUMN_WIDTH,
};

export const DISCOVERED_BY_COLUMN: ColumnDefinition = {
  name: 'discovered_by',
  displayName: 'Discovered By',
  isSortable: true,
  width: DEFAULT_COLUMN_WIDTH,
};

export const MELT_COLUMN: ColumnDefinition = {
  name: 'melt',
  displayName: 'Melting Point',
  isSortable: true,
  width: DEFAULT_COLUMN_WIDTH,
};

export const MOLAR_HEAT_COLUMN: ColumnDefinition = {
  name: 'molar_heat',
  displayName: 'Molar Heat',
  isSortable: true,
  width: DEFAULT_COLUMN_WIDTH,
};

export const NAMED_BY_COLUMN: ColumnDefinition = {
  name: 'named_by',
  displayName: 'Named By',
  isSortable: true,
  width: DEFAULT_COLUMN_WIDTH,
};

export const NUMBER_COLUMN: ColumnDefinition = {
  name: 'number',
  displayName: 'Number',
  isSortable: true,
  width: DEFAULT_COLUMN_WIDTH,
};

export const PERIOD_COLUMN: ColumnDefinition = {
  name: 'period',
  displayName: 'Period',
  isSortable: true,
  width: DEFAULT_COLUMN_WIDTH,
};

export const GROUP_COLUMN: ColumnDefinition = {
  name: 'group',
  displayName: 'Group',
  isSortable: true,
  width: DEFAULT_COLUMN_WIDTH,
};

export const PHASE_COLUMN: ColumnDefinition = {
  name: 'phase',
  displayName: 'Phase',
  isSortable: true,
  width: DEFAULT_COLUMN_WIDTH,
};

export const BOHR_MODEL_IMAGE_COLUMN: ColumnDefinition = {
  name: 'bohr_model_image',
  displayName: 'Bohr Model Image',
  isSortable: false,
  width: DEFAULT_COLUMN_WIDTH,
};

export const BOHR_MODEL_3D_COLUMN: ColumnDefinition = {
  name: 'bohr_model_3d',
  displayName: 'Bohr Model 3D',
  isSortable: false,
  width: DEFAULT_COLUMN_WIDTH,
};

export const SPECTRAL_IMG_COLUMN: ColumnDefinition = {
  name: 'spectral_img',
  displayName: 'Spectral Image',
  isSortable: false,
  width: DEFAULT_COLUMN_WIDTH,
};

export const SUMMARY_COLUMN: ColumnDefinition = {
  name: 'summary',
  displayName: 'Summary',
  isSortable: true,
  width: DEFAULT_COLUMN_WIDTH,
};

export const SYMBOL_COLUMN: ColumnDefinition = {
  name: 'symbol',
  displayName: 'Symbol',
  isSortable: true,
  width: DEFAULT_COLUMN_WIDTH,
};

export const XPOS_COLUMN: ColumnDefinition = {
  name: 'xpos',
  displayName: 'X Position',
  isSortable: true,
  width: DEFAULT_COLUMN_WIDTH,
};

export const YPOS_COLUMN: ColumnDefinition = {
  name: 'ypos',
  displayName: 'Y Position',
  isSortable: true,
  width: DEFAULT_COLUMN_WIDTH,
};

export const WXPOS_COLUMN: ColumnDefinition = {
  name: 'wxpos',
  displayName: 'Wide X Position',
  isSortable: true,
  width: DEFAULT_COLUMN_WIDTH,
};

export const WYPOS_COLUMN: ColumnDefinition = {
  name: 'wypos',
  displayName: 'Wide Y Position',
  isSortable: true,
  width: DEFAULT_COLUMN_WIDTH,
};

export const SHELLS_COLUMN: ColumnDefinition = {
  name: 'shells',
  displayName: 'Shells',
  isSortable: true,
  width: DEFAULT_COLUMN_WIDTH,
};

export const ELECTRON_CONFIGURATION_COLUMN: ColumnDefinition = {
  name: 'electron_configuration',
  displayName: 'Electron Configuration',
  isSortable: true,
  width: 200,
};

export const ELECTRON_CONFIGURATION_SEMANTIC_COLUMN: ColumnDefinition = {
  name: 'electron_configuration_semantic',
  displayName: 'Electron Configuration (Semantic)',
  isSortable: true,
  width: 300,
};

export const ELECTRON_AFFINITY_COLUMN: ColumnDefinition = {
  name: 'electron_affinity',
  displayName: 'Electron Affinity',
  isSortable: true,
  width: DEFAULT_COLUMN_WIDTH,
};

export const ELECTRONEGATIVITY_PAULING_COLUMN: ColumnDefinition = {
  name: 'electronegativity_pauling',
  displayName: 'Electronegativity (Pauling)',
  isSortable: true,
  width: 250,
};

export const IONIZATION_ENERGIES_COLUMN: ColumnDefinition = {
  name: 'ionization_energies',
  displayName: 'Ionization Energies',
  isSortable: true,
  width: DEFAULT_COLUMN_WIDTH,
};

export const IMAGE_COLUMN: ColumnDefinition = {
  name: 'image',
  displayName: 'Image',
  isSortable: false,
  width: DEFAULT_COLUMN_WIDTH,
};

export const BLOCK_COLUMN: ColumnDefinition = {
  name: 'block',
  displayName: 'Block',
  isSortable: true,
  width: DEFAULT_COLUMN_WIDTH,
};

// `source` is shown by default but intentionally omitted from the column
// chooser's full list, so it isn't part of FULL_LIST_OF_COLUMNS.
export const SOURCE_COLUMN: ColumnDefinition = {
  name: 'source',
  displayName: 'Source',
  isSortable: false,
  width: 300,
};

export const FULL_LIST_OF_COLUMNS: ColumnDefinition[] = [
  NAME_COLUMN,
  APPEARANCE_COLUMN,
  ATOMIC_MASS_COLUMN,
  BOIL_COLUMN,
  CATEGORY_COLUMN,
  DENSITY_COLUMN,
  DISCOVERED_BY_COLUMN,
  MELT_COLUMN,
  MOLAR_HEAT_COLUMN,
  NAMED_BY_COLUMN,
  NUMBER_COLUMN,
  PERIOD_COLUMN,
  GROUP_COLUMN,
  PHASE_COLUMN,
  BOHR_MODEL_IMAGE_COLUMN,
  BOHR_MODEL_3D_COLUMN,
  SPECTRAL_IMG_COLUMN,
  SUMMARY_COLUMN,
  SYMBOL_COLUMN,
  XPOS_COLUMN,
  YPOS_COLUMN,
  WXPOS_COLUMN,
  WYPOS_COLUMN,
  SHELLS_COLUMN,
  ELECTRON_CONFIGURATION_COLUMN,
  ELECTRON_CONFIGURATION_SEMANTIC_COLUMN,
  ELECTRON_AFFINITY_COLUMN,
  ELECTRONEGATIVITY_PAULING_COLUMN,
  IONIZATION_ENERGIES_COLUMN,
  IMAGE_COLUMN,
  BLOCK_COLUMN,
];

export const DEFAULT_COLUMNS: ColumnDefinition[] = [
  NAME_COLUMN,
  ATOMIC_MASS_COLUMN,
  SYMBOL_COLUMN,
  NUMBER_COLUMN,
  CATEGORY_COLUMN,
  PERIOD_COLUMN,
  GROUP_COLUMN,
  PHASE_COLUMN,
  SOURCE_COLUMN,
  ELECTRON_CONFIGURATION_COLUMN,
  ELECTRON_CONFIGURATION_SEMANTIC_COLUMN,
  BLOCK_COLUMN,
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
