import { Component, input, model } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-column-select',
  imports: [MatCardModule, MatCheckboxModule],
  templateUrl: './column-select.html',
  styleUrl: './column-select.scss',
})
export class ColumnSelect {
  readonly fullListOfColumns = input.required<string[]>();
  readonly columnsToDisplay = model.required<string[]>();

  setColumnsToDisplay(event: MatCheckboxChange, column: string) {
    if (event.checked) {
      this.columnsToDisplay.update((currentColumns) => {
        if (currentColumns.includes(column)) {
          return currentColumns;
        }

        const fullListOfColumns = this.fullListOfColumns();

        return [...currentColumns, column].sort((a, b) => {
          const columnAIndex = fullListOfColumns.indexOf(a);
          const columnBIndex = fullListOfColumns.indexOf(b);

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
      return currentColumns.filter((currentColumn) => currentColumn !== column);
    });
  }
}
