import { Service, effect, inject, signal } from '@angular/core';
import {
  DEFAULT_NAVIGATION_LAYOUT,
  NavigationLayout,
  isNavigationLayout,
} from '../interfaces/navigation';
import { LocalStorage } from './local-storage';

export const SETTINGS_STORAGE_KEY = 'example-angular-app.settings';

/** Shape written to local storage. */
export interface PersistedSettings {
  navigationLayout: NavigationLayout;
}

/**
 * Holds the preferences that shape the app chrome rather than the data it shows, and mirrors them
 * to local storage so a reload keeps the user in the navigation they picked.
 *
 * Settings are small and change only on explicit user action, so every change is written straight
 * away instead of being debounced the way `AppState` debounces drag driven column widths.
 */
@Service()
export class Settings {
  private readonly localStorage = inject(LocalStorage);
  private readonly layout = signal(this.restoreNavigationLayout() ?? DEFAULT_NAVIGATION_LAYOUT);

  /** Navigation chrome the app renders around the routed page. */
  readonly navigationLayout = this.layout.asReadonly();

  constructor() {
    effect(() => {
      const settings: PersistedSettings = { navigationLayout: this.layout() };

      this.localStorage.write(SETTINGS_STORAGE_KEY, settings);
    });
  }

  /** Switches the navigation chrome. Unknown values are ignored so persisted state stays valid. */
  setNavigationLayout(layout: NavigationLayout): void {
    if (!isNavigationLayout(layout)) {
      return;
    }

    this.layout.set(layout);
  }

  private restoreNavigationLayout(): NavigationLayout | null {
    return this.localStorage.read(SETTINGS_STORAGE_KEY, (value) => {
      if (typeof value !== 'object' || value === null) {
        return null;
      }

      const layout = (value as Partial<Record<keyof PersistedSettings, unknown>>).navigationLayout;

      return isNavigationLayout(layout) ? layout : null;
    });
  }
}
