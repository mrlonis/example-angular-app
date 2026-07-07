import { expect, test } from '@playwright/test';

test.describe('Toolbar route', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/toolbar');
  });

  test('renders icon actions and app title in toolbar', async ({ page }) => {
    await expect(page.locator('mat-toolbar')).toContainText('My App');
    const icons = page.locator('mat-toolbar mat-icon');
    const iconTexts = await icons.allTextContents();
    expect(iconTexts.map((t) => t.trim())).toEqual(
      expect.arrayContaining(['menu', 'favorite', 'share']),
    );
  });

  test('opens and closes the drawer from the menu button', async ({ page }) => {
    await expect(page.locator('mat-drawer')).not.toHaveClass(/mat-drawer-opened/);
    await page.locator('mat-toolbar button').first().click();
    await expect(page.locator('mat-drawer')).toHaveClass(/mat-drawer-opened/);
    await page.locator('mat-toolbar button').first().click();
    await expect(page.locator('mat-drawer')).not.toHaveClass(/mat-drawer-opened/);
  });
});
