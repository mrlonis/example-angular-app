import { type Page, expect, test } from '@playwright/test';
import { readNavigationLayout, useNavigationLayout } from './navigation-layout';

function settingsTrigger(page: Page) {
  return page.locator('[data-testid="settings-trigger"]');
}

function layoutOption(page: Page, layout: string) {
  return page.locator(`[data-testid="navigation-layout-${layout}"]`);
}

test.describe('Navigation layout setting', () => {
  test('starts on the tab layout', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('app-tabs-layout')).toBeAttached();
    await expect(page.locator('app-toolbar-layout')).not.toBeAttached();
    await expect(page.locator('mat-toolbar button[aria-label="Open menu"]')).not.toBeAttached();
  });

  test('exposes both layouts as checkable options', async ({ page }) => {
    await page.goto('/');
    await settingsTrigger(page).click();

    await expect(layoutOption(page, 'tabs')).toHaveAttribute('aria-checked', 'true');
    await expect(layoutOption(page, 'toolbar')).toHaveAttribute('aria-checked', 'false');
    await expect(layoutOption(page, 'tabs')).toHaveAttribute('role', 'menuitemradio');
    await expect(layoutOption(page, 'toolbar')).toHaveAttribute('role', 'menuitemradio');
  });

  test('swaps the chrome without leaving the current page', async ({ page }) => {
    await page.goto('/iframe-resizer');
    await expect(page.locator('app-tabs-layout')).toBeAttached();

    await settingsTrigger(page).click();
    await layoutOption(page, 'toolbar').click();

    await expect(page.locator('app-toolbar-layout')).toBeAttached();
    await expect(page.locator('app-tabs-layout')).not.toBeAttached();
    await expect(page).toHaveURL(/\/iframe-resizer$/);
    await expect(page.locator('iframe[appiframeresizer]')).toBeVisible();
  });

  test('persists the chosen layout across a reload', async ({ page }) => {
    await page.goto('/');

    await settingsTrigger(page).click();
    await layoutOption(page, 'toolbar').click();
    await expect(page.locator('app-toolbar-layout')).toBeAttached();
    expect(await readNavigationLayout(page)).toBe('toolbar');

    await page.reload();

    await expect(page.locator('app-toolbar-layout')).toBeAttached();
    await expect(page.locator('mat-toolbar button[aria-label="Open menu"]')).toBeVisible();
  });

  test('switches back to the tab layout', async ({ page }) => {
    await useNavigationLayout(page, 'toolbar');
    await page.goto('/');
    await expect(page.locator('app-toolbar-layout')).toBeAttached();

    await settingsTrigger(page).click();
    await layoutOption(page, 'tabs').click();

    await expect(page.locator('app-tabs-layout')).toBeAttached();
    await expect(page.locator('[role="tab"]', { hasText: 'Mat Table' })).toBeVisible();
  });

  test('falls back to the tab layout when the stored setting is unusable', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('example-angular-app.settings', 'not json');
    });
    await page.goto('/');

    await expect(page.locator('app-tabs-layout')).toBeAttached();
  });
});
