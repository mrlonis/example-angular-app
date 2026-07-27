import { expect, test } from '@playwright/test';

test.describe('Iframe resizer page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('shows the iframe tab in the tab list', async ({ page }) => {
    await expect(page.locator('[role="tab"]', { hasText: 'iframe-resizer' })).toBeVisible();
  });

  test('renders iframe with expected security and sizing attributes when selected', async ({
    page,
  }) => {
    await page.locator('[role="tab"]', { hasText: 'iframe-resizer' }).click();

    await expect(page).toHaveURL(/\/iframe-resizer$/);
    const iframe = page.locator('iframe[appiframeresizer]');
    await expect(iframe).toBeVisible();
    await expect(iframe).toHaveAttribute('width', '100%');
    await expect(iframe).toHaveAttribute('allow', 'microphone');
    await expect(iframe).toHaveAttribute('sandbox', /allow-scripts/);
    await expect(iframe).toHaveAttribute('sandbox', /allow-same-origin/);
    await expect(iframe).toHaveAttribute('src', /iframetester\.com/);
  });

  test('can switch between tabs without losing iframe visibility', async ({ page }) => {
    await page.locator('[role="tab"]', { hasText: 'iframe-resizer' }).click();
    await expect(page.locator('iframe[appiframeresizer]')).toBeVisible();

    await page.locator('[role="tab"]', { hasText: 'Mat Table' }).click();
    await expect(page.locator('app-mat-table')).toBeAttached();

    await page.locator('[role="tab"]', { hasText: 'iframe-resizer' }).click();
    await expect(page.locator('iframe[appiframeresizer]')).toBeVisible();
  });

  test('marks the selected tab and links it to the tab panel', async ({ page }) => {
    const iframeTab = page.locator('[role="tab"]', { hasText: 'iframe-resizer' });

    await expect(iframeTab).toHaveAttribute('aria-selected', 'false');
    await iframeTab.click();

    await expect(iframeTab).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('mat-tab-nav-panel')).toHaveAttribute('role', 'tabpanel');
  });
});
