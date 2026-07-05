import { Component, model } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FilterState } from '../../../interfaces/filter-state';

@Component({
  selector: 'app-filter',
  imports: [MatFormFieldModule, MatInputModule],
  templateUrl: './filter.html',
  styleUrl: './filter.scss',
})
export class Filter {
  readonly value = model<FilterState>({ name: '' });

  emitValue(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    const currentValue = this.value();
    this.value.set({ ...currentValue, name: filterValue.trim() });
  }
}
