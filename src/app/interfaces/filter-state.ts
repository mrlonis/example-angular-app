/** Value produced by the free text search box that sits above the table. */
export interface NameFilter {
  name: string;
}

/**
 * Everything the table filters on, serialized into `MatTableDataSource.filter`.
 *
 * `columnValues` maps a column name to the values picked in that column's header filter. A column
 * is only present while it has at least one selected value, so an empty record means "no column
 * filters are active".
 */
export interface FilterState extends NameFilter {
  columnValues: Record<string, string[]>;
}

export const EMPTY_FILTER_STATE: FilterState = { name: '', columnValues: {} };
