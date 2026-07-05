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

  setColumnsToDisplay(event: MatCheckboxChange, index: number) {
    if (event.checked) {
      this.columnsToDisplay.set(
        this.fullListOfColumns().filter((value, i) => {
          return i === index || this.columnsToDisplay().includes(value);
        }),
      );
    } else {
      this.columnsToDisplay.set(
        this.fullListOfColumns().filter((value, i) => {
          return i !== index && this.columnsToDisplay().includes(value);
        }),
      );
    }
  }
}
