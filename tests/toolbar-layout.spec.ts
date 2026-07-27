import { expect, test } from '@playwright/test';
import { useNavigationLayout } from './navigation-layout';

test.describe('Toolbar layout', () => {
  test.beforeEach(async ({ page }) => {
    await useNavigationLayout(page, 'toolbar');
    await page.goto('/');
    await expect(page.locator('app-toolbar-layout')).toBeAttached();
  });

  test('renders icon actions and app title in toolbar', async ({ page }) => {
    await expect(page.locator('mat-toolbar')).toContainText('My App');
    const icons = page.locator('mat-toolbar mat-icon');
    const iconNames = await icons.evaluateAll((elements) =>
      elements.map((element) => element.getAttribute('fontIcon')),
    );
    expect(iconNames).toEqual(expect.arrayContaining(['menu', 'favorite', 'share', 'settings']));
  });

  test('labels the icon-only toolbar buttons and hides their icons', async ({ page }) => {
    for (const label of ['Open menu', 'Favorite', 'Share', 'Settings']) {
      const button = page.locator(`mat-toolbar button[aria-label="${label}"]`);
      await expect(button).toBeVisible();
      await expect(button.locator('mat-icon')).toHaveAttribute('aria-hidden', 'true');
    }
  });

  test('opens and closes the drawer from the menu button', async ({ page }) => {
    const menuButton = page.locator('mat-toolbar button[aria-controls="app-drawer"]');

    await expect(page.locator('mat-drawer')).not.toHaveClass(/mat-drawer-opened/);
    await expect(menuButton).toHaveAttribute('aria-label', 'Open menu');
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false');

    await menuButton.click();
    await expect(page.locator('mat-drawer')).toHaveClass(/mat-drawer-opened/);
    await expect(menuButton).toHaveAttribute('aria-label', 'Close menu');
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true');

    await menuButton.click();
    await expect(page.locator('mat-drawer')).not.toHaveClass(/mat-drawer-opened/);
    await expect(menuButton).toHaveAttribute('aria-label', 'Open menu');
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  });

  test('lists every page in the drawer', async ({ page }) => {
    await page.locator('mat-toolbar button[aria-controls="app-drawer"]').click();

    await expect(page.locator('mat-drawer')).toContainText('Mat Table');
    await expect(page.locator('mat-drawer')).toContainText('iframe-resizer');
  });

  test('navigates between pages from the drawer and closes it', async ({ page }) => {
    const menuButton = page.locator('mat-toolbar button[aria-controls="app-drawer"]');

    await menuButton.click();
    await page.locator('mat-drawer a', { hasText: 'iframe-resizer' }).click();

    await expect(page).toHaveURL(/\/iframe-resizer$/);
    await expect(page.locator('iframe[appiframeresizer]')).toBeVisible();
    await expect(page.locator('mat-drawer')).not.toHaveClass(/mat-drawer-opened/);
    await expect(menuButton).toHaveAttribute('aria-label', 'Open menu');
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false');

    await menuButton.click();
    await page.locator('mat-drawer a', { hasText: 'Mat Table' }).click();

    await expect(page).toHaveURL(/\/mat-table$/);
    await expect(page.locator('app-mat-table')).toBeAttached();
  });

  test('marks the drawer link of the current page', async ({ page }) => {
    await page.locator('mat-toolbar button[aria-controls="app-drawer"]').click();

    await expect(page.locator('mat-drawer a', { hasText: 'Mat Table' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(page.locator('mat-drawer a', { hasText: 'iframe-resizer' })).not.toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  test('closes the drawer with the backdrop and keeps the menu button in sync', async ({
    page,
  }) => {
    const menuButton = page.locator('mat-toolbar button[aria-controls="app-drawer"]');

    await menuButton.click();
    await expect(menuButton).toHaveAttribute('aria-label', 'Close menu');

    await page.locator('.mat-drawer-backdrop').click();

    await expect(page.locator('mat-drawer')).not.toHaveClass(/mat-drawer-opened/);
    await expect(menuButton).toHaveAttribute('aria-label', 'Open menu');
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  });
});
