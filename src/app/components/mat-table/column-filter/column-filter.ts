import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { Component, computed, input, model, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ColumnDefinition } from '../../../interfaces/column-definition';

/**
 * Header cell control that opens an overlay for picking which values of a column stay visible in
 * the table. Selecting nothing means the column does not filter at all.
 */
@Component({
  selector: 'app-column-filter',
  imports: [
    A11yModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    OverlayModule,
  ],
  templateUrl: './column-filter.html',
  styleUrl: './column-filter.scss',
})
export class ColumnFilter {
  readonly column = input.required<ColumnDefinition>();
  readonly options = input.required<string[]>();
  readonly selectedValues = model.required<string[]>();

  readonly isOpen = signal(false);
  readonly hasSelection = computed(() => this.selectedValues().length > 0);
  readonly triggerLabel = computed(() => {
    const displayName = this.column().displayName;
    const selectedCount = this.selectedValues().length;

    return selectedCount === 0
      ? `Filter ${displayName} column`
      : `Filter ${displayName} column, ${selectedCount} selected`;
  });

  toggle(): void {
    this.isOpen.update((isOpen) => !isOpen);
  }

  close(): void {
    this.isOpen.set(false);
  }

  clear(): void {
    this.selectedValues.set([]);
  }
}
