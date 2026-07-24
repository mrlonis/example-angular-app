import { Component, computed, input, model } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { ColumnDefinition } from '../../../interfaces/column-definition';

@Component({
  selector: 'app-column-select',
  imports: [MatCardModule, MatCheckboxModule],
  templateUrl: './column-select.html',
  styleUrl: './column-select.scss',
})
export class ColumnSelect {
  readonly fullListOfColumns = input.required<ColumnDefinition[]>();
  readonly columnsToDisplay = model.required<ColumnDefinition[]>();

  private readonly displayedColumnNames = computed(
    () => new Set(this.columnsToDisplay().map((column) => column.name)),
  );

  readonly allColumnsSelected = computed(() => {
    const fullListOfColumns = this.fullListOfColumns();
    const displayed = this.displayedColumnNames();

    return (
      fullListOfColumns.length > 0 &&
      fullListOfColumns.every((column) => displayed.has(column.name))
    );
  });

  readonly partiallyComplete = computed(() => {
    const displayed = this.displayedColumnNames();
    const someSelected = this.fullListOfColumns().some((column) => displayed.has(column.name));

    return someSelected && !this.allColumnsSelected();
  });

  isColumnDisplayed(column: ColumnDefinition): boolean {
    return this.displayedColumnNames().has(column.name);
  }

  setColumnsToDisplay(event: MatCheckboxChange, column: ColumnDefinition) {
    if (event.checked) {
      this.columnsToDisplay.update((currentColumns) => {
        if (currentColumns.some((currentColumn) => currentColumn.name === column.name)) {
          return currentColumns;
        }

        return this.sortByFullListOrder([...currentColumns, column]);
      });
      return;
    }

    this.columnsToDisplay.update((currentColumns) =>
      currentColumns.filter((currentColumn) => currentColumn.name !== column.name),
    );
  }

  setAllColumnsToDisplay(checked: boolean) {
    const fullListOfColumns = this.fullListOfColumns();

    if (checked) {
      this.columnsToDisplay.update((currentColumns) => {
        const displayed = new Set(currentColumns.map((column) => column.name));
        const columnsToAdd = fullListOfColumns.filter((column) => !displayed.has(column.name));

        if (columnsToAdd.length === 0) {
          return currentColumns;
        }

        return this.sortByFullListOrder([...currentColumns, ...columnsToAdd]);
      });
      return;
    }

    const fullListColumnNames = new Set(fullListOfColumns.map((column) => column.name));
    this.columnsToDisplay.update((currentColumns) =>
      currentColumns.filter((column) => !fullListColumnNames.has(column.name)),
    );
  }

  private sortByFullListOrder(columns: ColumnDefinition[]): ColumnDefinition[] {
    const fullListOfColumns = this.fullListOfColumns();
    const indexByName = new Map(fullListOfColumns.map((column, index) => [column.name, index]));
    const orderOf = (name: string) => indexByName.get(name) ?? Number.POSITIVE_INFINITY;

    return [...columns].sort((a, b) => {
      const orderA = orderOf(a.name);
      const orderB = orderOf(b.name);

      if (orderA === orderB) {
        return 0;
      }

      return orderA - orderB;
    });
  }
}
