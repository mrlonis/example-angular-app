import { type Page } from '@playwright/test';

/** Mirrors `SETTINGS_STORAGE_KEY` in `src/app/services/settings.ts`. */
export const SETTINGS_STORAGE_KEY = 'example-angular-app.settings';

export type NavigationLayout = 'tabs' | 'toolbar';

/**
 * Seeds the persisted navigation layout so the app boots straight into it. The layout is a user
 * setting rather than a route, so this is how a spec picks the chrome it wants to exercise.
 *
 * Must be called before the first `page.goto`, and it keeps applying across reloads.
 */
export async function useNavigationLayout(page: Page, layout: NavigationLayout): Promise<void> {
  await page.addInitScript(
    ([key, value]: [string, string]) => {
      window.localStorage.setItem(key, value);
    },
    [SETTINGS_STORAGE_KEY, JSON.stringify({ navigationLayout: layout })] as [string, string],
  );
}

/** Reads the navigation layout the app has persisted. */
export async function readNavigationLayout(page: Page): Promise<string | null> {
  return page.evaluate((key: string) => {
    const rawValue = window.localStorage.getItem(key);

    if (rawValue === null) {
      return null;
    }

    return (JSON.parse(rawValue) as { navigationLayout?: string }).navigationLayout ?? null;
  }, SETTINGS_STORAGE_KEY);
}
