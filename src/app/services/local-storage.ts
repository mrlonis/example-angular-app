import { DOCUMENT } from '@angular/common';
import { Service, inject } from '@angular/core';

/**
 * Thin, failure tolerant wrapper around the browser's local storage.
 *
 * Every operation degrades to a no-op when storage is unavailable (server side rendering,
 * private browsing modes, disabled cookies) or when the browser throws while reading or
 * writing (for example `QuotaExceededError`), so callers never have to guard their state.
 */
@Service()
export class LocalStorage {
  private readonly document = inject(DOCUMENT);

  /**
   * Reads and JSON parses the value stored under `key`. The raw parsed value is handed to
   * `parse` so the caller can validate it before trusting persisted data.
   */
  read<T>(key: string, parse: (value: unknown) => T | null): T | null {
    const rawValue = this.withStorage((storage) => storage.getItem(key));

    if (rawValue === null) {
      return null;
    }

    let parsedValue: unknown;

    try {
      parsedValue = JSON.parse(rawValue);
    } catch {
      // The stored value is not valid JSON, for example because it was written by an older
      // version of the app or by another tool. Treat it as if nothing was stored.
      return null;
    }

    return parse(parsedValue);
  }

  /** JSON serializes `value` and stores it under `key`. */
  write(key: string, value: unknown): void {
    this.withStorage((storage) => {
      // Serialization happens inside the guard so a value that cannot be serialized (a circular
      // reference, a bigint) degrades to a no-op instead of throwing at the caller.
      const serializedValue = JSON.stringify(value);

      // `JSON.stringify` returns undefined, rather than throwing, for values without a JSON
      // representation (undefined, functions, symbols). Writing that would store the literal
      // string "undefined", so skip the write and leave any existing value untouched.
      if (serializedValue === undefined) {
        return null;
      }

      storage.setItem(key, serializedValue);

      return true;
    });
  }

  /** Removes the value stored under `key`. */
  remove(key: string): void {
    this.withStorage((storage) => {
      storage.removeItem(key);

      return true;
    });
  }

  private withStorage<T>(operation: (storage: Storage) => T | null): T | null {
    try {
      const storage = this.document.defaultView?.localStorage;

      return storage ? operation(storage) : null;
    } catch {
      // Storage can throw when it is disabled by the browser, when a write exceeds the available
      // quota, or when a value cannot be serialized. Persistence is a convenience here, so
      // failures are ignored.
      return null;
    }
  }
}
