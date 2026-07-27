import { expect, test } from '@playwright/test';
import { useNavigationLayout } from './navigation-layout';

test.describe('App', () => {
  test('shows the application title in the document title', async ({ page }) => {
    await page.goto('');

    await expect(page).toHaveTitle(/Example Angular App/);
  });
});

test.describe('App shell and routing', () => {
  test('redirects the default route to the mat table page', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveURL(/\/mat-table$/);
    await expect(
      page.locator('tr.mat-mdc-row.example-element-row').first().locator('td.mat-column-name'),
    ).toContainText('Hydrogen');
  });

  test('keeps the app bar above every layout', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('mat-toolbar')).toContainText('My App');

    await page.goto('/iframe-resizer');
    await expect(page.locator('mat-toolbar')).toContainText('My App');
  });

  test('loads the iframe resizer page directly', async ({ page }) => {
    await page.goto('/iframe-resizer');

    await expect(page.locator('app-iframe-resizer')).toBeAttached();
    await expect(page.locator('iframe[appiframeresizer]')).toBeVisible();
  });

  test('sends the retired toolbar route to the mat table page', async ({ page }) => {
    await page.goto('/toolbar');

    await expect(page).toHaveURL(/\/mat-table$/);
    await expect(page.locator('app-mat-table')).toBeAttached();
  });

  test('serves the same pages through the drawer layout', async ({ page }) => {
    await useNavigationLayout(page, 'toolbar');
    await page.goto('/');

    await expect(page).toHaveURL(/\/mat-table$/);
    await expect(page.locator('app-toolbar-layout')).toBeAttached();
    await expect(page.locator('app-mat-table')).toBeAttached();
  });
});
