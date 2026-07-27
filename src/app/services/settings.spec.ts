import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { PersistedSettings, SETTINGS_STORAGE_KEY, Settings } from './settings';

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

function storedSettings(storage: Storage): PersistedSettings | null {
  const rawValue = storage.getItem(SETTINGS_STORAGE_KEY);

  return rawValue === null ? null : (JSON.parse(rawValue) as PersistedSettings);
}

function createService(storage: Storage): Settings {
  TestBed.configureTestingModule({
    providers: [{ provide: DOCUMENT, useValue: { defaultView: { localStorage: storage } } }],
  });

  return TestBed.inject(Settings);
}

describe('Settings', () => {
  it('defaults to the tab layout when nothing is stored', () => {
    const service = createService(createStorage());

    expect(service.navigationLayout()).toBe('tabs');
  });

  it('restores a persisted navigation layout', () => {
    const storage = createStorage({
      [SETTINGS_STORAGE_KEY]: JSON.stringify({ navigationLayout: 'toolbar' }),
    });

    const service = createService(storage);

    expect(service.navigationLayout()).toBe('toolbar');
  });

  it('persists a layout change', () => {
    const storage = createStorage();
    const service = createService(storage);

    service.setNavigationLayout('toolbar');
    TestBed.tick();

    expect(service.navigationLayout()).toBe('toolbar');
    expect(storedSettings(storage)).toEqual({ navigationLayout: 'toolbar' });
  });

  it('ignores an unknown layout', () => {
    const service = createService(createStorage());

    service.setNavigationLayout('sidebar' as never);

    expect(service.navigationLayout()).toBe('tabs');
  });

  it('falls back to the default when the persisted layout is unknown', () => {
    const storage = createStorage({
      [SETTINGS_STORAGE_KEY]: JSON.stringify({ navigationLayout: 'sidebar' }),
    });

    const service = createService(storage);

    expect(service.navigationLayout()).toBe('tabs');
  });

  it('falls back to the default when the persisted value is not an object', () => {
    const storage = createStorage({ [SETTINGS_STORAGE_KEY]: JSON.stringify('toolbar') });

    const service = createService(storage);

    expect(service.navigationLayout()).toBe('tabs');
  });

  it('works when local storage is unavailable', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: DOCUMENT, useValue: { defaultView: null } }],
    });
    const service = TestBed.inject(Settings);

    service.setNavigationLayout('toolbar');
    TestBed.tick();

    expect(service.navigationLayout()).toBe('toolbar');
  });
});
