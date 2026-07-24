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

    return [...columns].sort((a, b) => {
      const columnAIndex = fullListOfColumns.findIndex((current) => current.name === a.name);
      const columnBIndex = fullListOfColumns.findIndex((current) => current.name === b.name);

      if (columnAIndex === -1 && columnBIndex === -1) {
        return 0;
      }
      if (columnAIndex === -1) {
        return 1;
      }
      if (columnBIndex === -1) {
        return -1;
      }

      return columnAIndex - columnBIndex;
    });
  }
}
