import { Component, input, model } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-column-select',
  imports: [MatIconModule, MatSelectModule],
  templateUrl: './column-select.html',
  styleUrl: './column-select.scss',
})
export class ColumnSelect {
  readonly fullListOfColumns = input.required<string[]>();
  readonly columnsToDisplay = model.required<string[]>();

  setColumnsToDisplay(columns: string[]) {
    this.columnsToDisplay.set(columns);
  }
}
