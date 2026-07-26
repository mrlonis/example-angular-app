import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { LocalStorage } from './local-storage';

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

function createService(defaultView: unknown): LocalStorage {
  TestBed.configureTestingModule({
    providers: [{ provide: DOCUMENT, useValue: { defaultView } }],
  });

  return TestBed.inject(LocalStorage);
}

function asString(value: unknown): string | null {
  return typeof value === 'string' ? value : null;
}

describe('LocalStorage', () => {
  describe('with a working storage', () => {
    let storage: Storage;
    let service: LocalStorage;

    beforeEach(() => {
      storage = createStorage();
      service = createService({ localStorage: storage });
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('returns null when nothing is stored under the key', () => {
      expect(service.read('missing', asString)).toBeNull();
    });

    it('parses the stored JSON value before handing it to the parser', () => {
      storage.setItem('user', JSON.stringify({ name: 'Ada' }));
      const parse = vi.fn((value: unknown) => value);

      const result = service.read('user', parse);

      expect(parse).toHaveBeenCalledWith({ name: 'Ada' });
      expect(result).toEqual({ name: 'Ada' });
    });

    it('returns null when the stored value is not valid JSON', () => {
      storage.setItem('broken', '{ not json');

      expect(service.read('broken', asString)).toBeNull();
    });

    it('returns null when the parser rejects the stored value', () => {
      storage.setItem('count', JSON.stringify(42));

      expect(service.read('count', asString)).toBeNull();
    });

    it('serializes values when writing', () => {
      service.write('user', { name: 'Ada' });

      expect(storage.getItem('user')).toBe('{"name":"Ada"}');
    });

    it('reads back what it wrote', () => {
      service.write('columns', ['name', 'symbol']);

      expect(service.read('columns', (value) => value as string[])).toEqual(['name', 'symbol']);
    });

    it('removes a stored value', () => {
      service.write('user', { name: 'Ada' });
      service.remove('user');

      expect(storage.getItem('user')).toBeNull();
    });

    it('rethrows errors raised by the parser', () => {
      storage.setItem('user', '"Ada"');

      expect(() =>
        service.read('user', () => {
          throw new TypeError('Parser blew up');
        }),
      ).toThrow(TypeError);
    });
  });

  describe('when storage is unavailable', () => {
    it('degrades to no-ops when there is no window', () => {
      const service = createService(undefined);

      expect(service.read('user', asString)).toBeNull();
      expect(() => {
        service.write('user', { name: 'Ada' });
      }).not.toThrow();
      expect(() => {
        service.remove('user');
      }).not.toThrow();
    });

    it('degrades to no-ops when accessing storage throws', () => {
      const service = createService({
        get localStorage(): Storage {
          throw new Error('Storage is disabled');
        },
      });

      expect(service.read('user', asString)).toBeNull();
      expect(() => {
        service.write('user', { name: 'Ada' });
      }).not.toThrow();
    });

    it('ignores read failures', () => {
      const storage = createStorage();
      vi.spyOn(storage, 'getItem').mockImplementation(() => {
        throw new Error('Read denied');
      });
      const service = createService({ localStorage: storage });

      expect(service.read('user', asString)).toBeNull();
    });

    it('ignores write failures such as an exceeded quota', () => {
      const storage = createStorage();
      vi.spyOn(storage, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      const service = createService({ localStorage: storage });

      expect(() => {
        service.write('user', { name: 'Ada' });
      }).not.toThrow();
    });

    it('ignores values that cannot be serialized', () => {
      const storage = createStorage();
      const service = createService({ localStorage: storage });
      const circularValue: Record<string, unknown> = {};
      circularValue['self'] = circularValue;

      expect(() => {
        service.write('user', circularValue);
      }).not.toThrow();
      expect(storage.getItem('user')).toBeNull();
    });
  });
});
