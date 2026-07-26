import { expect, test } from '@playwright/test';

test.describe('Toolbar route', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/toolbar');
  });

  test('renders icon actions and app title in toolbar', async ({ page }) => {
    await expect(page.locator('mat-toolbar')).toContainText('My App');
    const icons = page.locator('mat-toolbar mat-icon');
    const iconNames = await icons.evaluateAll((elements) =>
      elements.map((element) => element.getAttribute('fontIcon')),
    );
    expect(iconNames).toEqual(expect.arrayContaining(['menu', 'favorite', 'share']));
  });

  test('labels the icon-only toolbar buttons and hides their icons', async ({ page }) => {
    for (const label of ['Open menu', 'Favorite', 'Share']) {
      const button = page.locator(`mat-toolbar button[aria-label="${label}"]`);
      await expect(button).toBeVisible();
      await expect(button.locator('mat-icon')).toHaveAttribute('aria-hidden', 'true');
    }
  });

  test('opens and closes the drawer from the menu button', async ({ page }) => {
    await expect(page.locator('mat-drawer')).not.toHaveClass(/mat-drawer-opened/);
    await page.locator('mat-toolbar button').first().click();
    await expect(page.locator('mat-drawer')).toHaveClass(/mat-drawer-opened/);
    await page.locator('mat-toolbar button').first().click();
    await expect(page.locator('mat-drawer')).not.toHaveClass(/mat-drawer-opened/);
  });
});
