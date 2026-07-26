import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { ColumnDefinition } from '../interfaces/column-definition';
import {
  ATOMIC_MASS_COLUMN,
  DEFAULT_COLUMNS,
  FULL_LIST_OF_COLUMNS,
  NAME_COLUMN,
  SYMBOL_COLUMN,
} from '../interfaces/columns';
import { AppState, PersistedTableState, TABLE_STATE_STORAGE_KEY } from './app-state';

function createStorage(entries: Record<string, string> = {}): Storage {
  const values = new Map(Object.entries(entries));

  return {
    get length() {
      return values.size;
    },
    clear: () => values.clear(),
    getItem: (key: string) => values.get(key) ?? null,
    key: (index: number) => Array.from(values.keys())[index] ?? null,
    removeItem: (key: string) => {
      values.delete(key);
    },
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
  };
}

function storedState(storage: Storage): PersistedTableState | null {
  const rawValue = storage.getItem(TABLE_STATE_STORAGE_KEY);

  return rawValue === null ? null : (JSON.parse(rawValue) as PersistedTableState);
}

function createService(storage: Storage): AppState {
  TestBed.configureTestingModule({
    providers: [{ provide: DOCUMENT, useValue: { defaultView: { localStorage: storage } } }],
  });

  return TestBed.inject(AppState);
}

function widthOf(columns: ColumnDefinition[], name: string): number | undefined {
  return columns.find((column) => column.name === name)?.width;
}

function columnNames(columns: ColumnDefinition[]): string[] {
  return columns.map((column) => column.name);
}

describe('AppState', () => {
  describe('with empty storage', () => {
    let storage: Storage;
    let service: AppState;

    beforeEach(() => {
      storage = createStorage();
      service = createService(storage);
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('displays the default columns', () => {
      expect(service.columnsToDisplay()).toEqual(DEFAULT_COLUMNS);
    });

    it('exposes the full list of selectable columns', () => {
      expect(service.fullListOfColumns()).toEqual(FULL_LIST_OF_COLUMNS);
    });

    it('replaces the displayed columns', () => {
      service.setColumnsToDisplay([SYMBOL_COLUMN, NAME_COLUMN]);

      expect(service.columnsToDisplay()).toEqual([SYMBOL_COLUMN, NAME_COLUMN]);
    });

    it('ignores unknown columns when setting the displayed columns', () => {
      const unknownColumn: ColumnDefinition = {
        name: 'unknown',
        displayName: 'Unknown',
        isSortable: false,
        width: 100,
      };

      service.setColumnsToDisplay([NAME_COLUMN, unknownColumn]);

      expect(service.columnsToDisplay()).toEqual([NAME_COLUMN]);
    });

    it('ignores duplicated columns when setting the displayed columns', () => {
      service.setColumnsToDisplay([NAME_COLUMN, NAME_COLUMN, SYMBOL_COLUMN]);

      expect(columnNames(service.columnsToDisplay())).toEqual(['name', 'symbol']);
    });

    it('applies a new width to the column definition', () => {
      service.setColumnWidth('name', 240);

      expect(widthOf(service.columnsToDisplay(), 'name')).toBe(240);
      expect(widthOf(service.fullListOfColumns(), 'name')).toBe(240);
    });

    it('keeps the width of a column that is hidden and displayed again', () => {
      service.setColumnWidth('atomic_mass', 320);
      service.setColumnsToDisplay([NAME_COLUMN]);
      service.setColumnsToDisplay([NAME_COLUMN, ATOMIC_MASS_COLUMN]);

      expect(widthOf(service.columnsToDisplay(), 'atomic_mass')).toBe(320);
    });

    it('ignores widths for unknown columns', () => {
      expect(() => {
        service.setColumnWidth('unknown', 240);
      }).not.toThrow();
      expect(service.columnsToDisplay()).toEqual(DEFAULT_COLUMNS);
    });

    it.each([0, -10, Number.NaN, Number.POSITIVE_INFINITY])(
      'ignores the invalid width %s',
      (width) => {
        service.setColumnWidth('name', width);

        expect(widthOf(service.columnsToDisplay(), 'name')).toBe(NAME_COLUMN.width);
      },
    );
  });

  describe('persistence', () => {
    let storage: Storage;
    let service: AppState;

    beforeEach(() => {
      storage = createStorage();
      service = createService(storage);
    });

    it('persists the displayed columns', () => {
      service.setColumnsToDisplay([NAME_COLUMN, SYMBOL_COLUMN]);
      TestBed.tick();

      expect(storedState(storage)?.displayedColumns).toEqual(['name', 'symbol']);
    });

    it('persists only the widths that differ from the defaults', () => {
      service.setColumnWidth('name', 240);
      TestBed.tick();

      expect(storedState(storage)?.columnWidths).toEqual({ name: 240 });
    });

    it('persists widths of columns that are not displayed', () => {
      service.setColumnWidth('appearance', 240);
      service.setColumnsToDisplay([NAME_COLUMN]);
      TestBed.tick();

      expect(storedState(storage)?.columnWidths).toEqual({ appearance: 240 });
    });

    it('persists an empty selection when every column is hidden', () => {
      service.setColumnsToDisplay([]);
      TestBed.tick();

      expect(storedState(storage)?.displayedColumns).toEqual([]);
    });
  });

  describe('hydration', () => {
    function hydrate(value: unknown): AppState {
      return createService(createStorage({ [TABLE_STATE_STORAGE_KEY]: JSON.stringify(value) }));
    }

    it('restores the displayed columns from storage', () => {
      const service = hydrate({ displayedColumns: ['symbol', 'name'], columnWidths: {} });

      expect(columnNames(service.columnsToDisplay())).toEqual(['symbol', 'name']);
    });

    it('restores column widths from storage', () => {
      const service = hydrate({ displayedColumns: ['name'], columnWidths: { name: 240 } });

      expect(widthOf(service.columnsToDisplay(), 'name')).toBe(240);
    });

    it('restores widths of columns that are not displayed', () => {
      const service = hydrate({ displayedColumns: ['name'], columnWidths: { symbol: 240 } });

      expect(widthOf(service.fullListOfColumns(), 'symbol')).toBe(240);
    });

    it('restores an empty selection', () => {
      const service = hydrate({ displayedColumns: [], columnWidths: {} });

      expect(service.columnsToDisplay()).toEqual([]);
    });

    it('drops unknown column names', () => {
      const service = hydrate({ displayedColumns: ['name', 'not-a-column'], columnWidths: {} });

      expect(columnNames(service.columnsToDisplay())).toEqual(['name']);
    });

    it('drops duplicated column names', () => {
      const service = hydrate({ displayedColumns: ['name', 'name'], columnWidths: {} });

      expect(columnNames(service.columnsToDisplay())).toEqual(['name']);
    });

    it('ignores invalid widths', () => {
      const service = hydrate({
        displayedColumns: ['name', 'symbol'],
        columnWidths: { name: 'wide', symbol: -20 },
      });

      expect(widthOf(service.columnsToDisplay(), 'name')).toBe(NAME_COLUMN.width);
      expect(widthOf(service.columnsToDisplay(), 'symbol')).toBe(SYMBOL_COLUMN.width);
    });

    it.each([null, 'not an object', 42])(
      'falls back to the defaults for the payload %s',
      (value) => {
        const service = hydrate(value);

        expect(service.columnsToDisplay()).toEqual(DEFAULT_COLUMNS);
      },
    );

    it('falls back to the default columns when the selection is missing', () => {
      const service = hydrate({ columnWidths: { name: 240 } });

      expect(columnNames(service.columnsToDisplay())).toEqual(columnNames(DEFAULT_COLUMNS));
      expect(widthOf(service.columnsToDisplay(), 'name')).toBe(240);
    });

    it('falls back to the default widths when the widths are missing', () => {
      const service = hydrate({ displayedColumns: ['name'] });

      expect(widthOf(service.columnsToDisplay(), 'name')).toBe(NAME_COLUMN.width);
    });

    it('falls back to the defaults when the stored value is not valid JSON', () => {
      const service = createService(createStorage({ [TABLE_STATE_STORAGE_KEY]: '{ not json' }));

      expect(service.columnsToDisplay()).toEqual(DEFAULT_COLUMNS);
    });
  });

  describe('without storage', () => {
    it('still exposes the default state', () => {
      TestBed.configureTestingModule({
        providers: [{ provide: DOCUMENT, useValue: { defaultView: undefined } }],
      });
      const service = TestBed.inject(AppState);

      expect(service.columnsToDisplay()).toEqual(DEFAULT_COLUMNS);
      expect(() => {
        service.setColumnWidth('name', 240);
        TestBed.tick();
      }).not.toThrow();
    });
  });
});
