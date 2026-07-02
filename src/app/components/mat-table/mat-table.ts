import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ELEMENT_DATA } from '../../interfaces/data';
import { PeriodicElement } from '../../interfaces/periodic-element';

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
  selector: 'app-table',
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSelectModule,
    MatTableModule,
    MatSortModule,
    ReactiveFormsModule,
  ],
  templateUrl: './mat-table.html',
  styleUrl: './mat-table.scss',
})
export class MatTable implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  dataSource = new MatTableDataSource(ELEMENT_DATA.elements);
  columnsToDisplay = new FormControl<string[]>(DEFAULT_COLUMNS, { nonNullable: true });
  columnsToDisplayWithExpand = [...DEFAULT_COLUMNS, 'expand'];
  fullListOfColumns = FULL_LIST_OF_COLUMNS;
  expandedElement: PeriodicElement | null = null;

  ngOnInit(): void {
    this.columnsToDisplay.valueChanges.subscribe((columns) => {
      this.columnsToDisplayWithExpand = [...columns, 'expand'];
    });
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  isExpanded(element: PeriodicElement) {
    return this.expandedElement === element;
  }
}
