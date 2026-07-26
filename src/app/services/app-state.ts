import { Service, computed, effect, inject, signal } from '@angular/core';
import { ColumnDefinition } from '../interfaces/column-definition';
import { ALL_COLUMNS, DEFAULT_COLUMNS, FULL_LIST_OF_COLUMNS } from '../interfaces/columns';
import { LocalStorage } from './local-storage';

export const TABLE_STATE_STORAGE_KEY = 'example-angular-app.table-state';

/** Shape written to local storage. Only user owned state is persisted. */
export interface PersistedTableState {
  displayedColumns: string[];
  columnWidths: Record<string, number>;
}

interface RestoredTableState {
  displayedColumns: string[] | null;
  columnWidths: Record<string, number>;
}

function isValidWidth(width: unknown): width is number {
  return typeof width === 'number' && Number.isFinite(width) && width > 0;
}

/**
 * Holds the state the user can change while using the app and keeps it in local storage so a
 * page reload restores it.
 *
 * Column widths live on the `ColumnDefinition` objects of a catalog that covers every known
 * column, not only the displayed ones. Hiding a column therefore keeps the width the user last
 * left it at, and re-displaying the column brings that width back.
 */
@Service()
export class AppState {
  private readonly localStorage = inject(LocalStorage);
  private readonly restoredState = this.restoreTableState();

  private readonly columnCatalog = signal(
    this.createColumnCatalog(this.restoredState?.columnWidths ?? {}),
  );
  private readonly displayedColumnNames = signal(
    this.restoredState?.displayedColumns ?? DEFAULT_COLUMNS.map((column) => column.name),
  );

  /** Displayed columns, in display order, carrying their current widths. */
  readonly columnsToDisplay = computed(() => {
    const catalog = this.columnCatalog();

    return this.displayedColumnNames()
      .map((name) => catalog.get(name))
      .filter((column) => column !== undefined);
  });

  /** Every column offered by the column chooser, carrying its current width. */
  readonly fullListOfColumns = computed(() => {
    const catalog = this.columnCatalog();

    return FULL_LIST_OF_COLUMNS.map((column) => catalog.get(column.name) ?? column);
  });

  // Only widths that differ from the built-in defaults are persisted, so changing a default in
  // code still reaches users who never resized that column.
  private readonly columnWidthOverrides = computed(() => {
    const catalog = this.columnCatalog();
    const overrides: Record<string, number> = {};

    for (const column of ALL_COLUMNS) {
      const currentWidth = catalog.get(column.name)?.width;

      if (currentWidth !== undefined && currentWidth !== column.width) {
        overrides[column.name] = currentWidth;
      }
    }

    return overrides;
  });

  constructor() {
    effect(() => {
      const state: PersistedTableState = {
        displayedColumns: this.displayedColumnNames(),
        columnWidths: this.columnWidthOverrides(),
      };

      this.localStorage.write(TABLE_STATE_STORAGE_KEY, state);
    });
  }

  /** Replaces the displayed columns, ignoring unknown and duplicated columns. */
  setColumnsToDisplay(columns: ColumnDefinition[]): void {
    const catalog = this.columnCatalog();
    const names: string[] = [];

    for (const column of columns) {
      if (catalog.has(column.name) && !names.includes(column.name)) {
        names.push(column.name);
      }
    }

    this.displayedColumnNames.set(names);
  }

  /** Stores the width of a column, whether or not the column is currently displayed. */
  setColumnWidth(name: string, width: number): void {
    if (!isValidWidth(width)) {
      return;
    }

    this.columnCatalog.update((catalog) => {
      const column = catalog.get(name);

      if (!column || column.width === width) {
        return catalog;
      }

      const updatedCatalog = new Map(catalog);
      updatedCatalog.set(name, { ...column, width });

      return updatedCatalog;
    });
  }

  private createColumnCatalog(columnWidths: Record<string, number>): Map<string, ColumnDefinition> {
    return new Map(
      ALL_COLUMNS.map((column) => {
        const width = columnWidths[column.name];

        return [column.name, isValidWidth(width) ? { ...column, width } : column];
      }),
    );
  }

  private restoreTableState(): RestoredTableState | null {
    return this.localStorage.read(TABLE_STATE_STORAGE_KEY, (value) => this.parseTableState(value));
  }

  private parseTableState(value: unknown): RestoredTableState | null {
    if (typeof value !== 'object' || value === null) {
      return null;
    }

    const state = value as Partial<Record<keyof PersistedTableState, unknown>>;

    return {
      displayedColumns: this.parseDisplayedColumns(state.displayedColumns),
      columnWidths: this.parseColumnWidths(state.columnWidths),
    };
  }

  private parseDisplayedColumns(value: unknown): string[] | null {
    if (!Array.isArray(value)) {
      return null;
    }

    const knownColumnNames = new Set(ALL_COLUMNS.map((column) => column.name));
    const displayedColumns: string[] = [];

    for (const name of value as unknown[]) {
      if (
        typeof name === 'string' &&
        knownColumnNames.has(name) &&
        !displayedColumns.includes(name)
      ) {
        displayedColumns.push(name);
      }
    }

    return displayedColumns;
  }

  private parseColumnWidths(value: unknown): Record<string, number> {
    if (typeof value !== 'object' || value === null) {
      return {};
    }

    const widths: Record<string, number> = {};

    for (const column of ALL_COLUMNS) {
      const width = (value as Record<string, unknown>)[column.name];

      if (isValidWidth(width)) {
        widths[column.name] = width;
      }
    }

    return widths;
  }
}
