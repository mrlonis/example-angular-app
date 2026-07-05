import { Component, output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-filter',
  imports: [MatFormFieldModule, MatInputModule],
  templateUrl: './filter.html',
  styleUrl: './filter.scss',
})
export class Filter {
  readonly valueChange = output<string>();

  emitValue(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.valueChange.emit(filterValue.trim().toLowerCase());
  }
}
