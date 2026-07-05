import { Component, computed, effect, signal, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ELEMENT_DATA } from '../../interfaces/data';
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

@Component({
  selector: 'app-mat-table',
  imports: [
    ColumnSelect,
    Filter,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    PeriodicElementDetail,
  ],
  templateUrl: './mat-table.html',
  styleUrl: './mat-table.scss',
})
export class MatTable {
  readonly paginator = viewChild(MatPaginator);
  readonly sort = viewChild(MatSort);

  readonly dataSource = new MatTableDataSource(ELEMENT_DATA.elements);
  readonly columnsToDisplay = signal<string[]>(DEFAULT_COLUMNS);
  readonly columnsToDisplayWithExpand = computed(() => [...this.columnsToDisplay(), 'expand']);
  readonly fullListOfColumns = FULL_LIST_OF_COLUMNS;
  readonly defaultColumns = DEFAULT_COLUMNS;
  readonly expandedElement = signal<PeriodicElement | null>(null);

  constructor() {
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

  setColumnsToDisplay(columns: string[]) {
    this.columnsToDisplay.set(columns);
  }

  applyFilter(event: string) {
    this.dataSource.filter = event;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  toggleExpanded(element: PeriodicElement) {
    this.expandedElement.update((current) => (current === element ? null : element));
  }

  isExpanded(element: PeriodicElement) {
    return this.expandedElement() === element;
  }
}
