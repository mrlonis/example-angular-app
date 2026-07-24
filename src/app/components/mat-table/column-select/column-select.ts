import { Component, input, model } from '@angular/core';
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

  isColumnDisplayed(column: ColumnDefinition): boolean {
    return this.columnsToDisplay().some((displayed) => displayed.name === column.name);
  }

  setColumnsToDisplay(event: MatCheckboxChange, column: ColumnDefinition) {
    if (event.checked) {
      this.columnsToDisplay.update((currentColumns) => {
        if (currentColumns.some((currentColumn) => currentColumn.name === column.name)) {
          return currentColumns;
        }

        const fullListOfColumns = this.fullListOfColumns();

        return [...currentColumns, column].sort((a, b) => {
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
      });
      return;
    }

    this.columnsToDisplay.update((currentColumns) => {
      return currentColumns.filter((currentColumn) => currentColumn.name !== column.name);
    });
  }
}
