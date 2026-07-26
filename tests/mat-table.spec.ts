import { type Page, expect, test } from '@playwright/test';

function getDataRows(page: Page) {
  return page.locator('tr.mat-mdc-row.example-element-row');
}

function getRow(page: Page, index: number) {
  return getDataRows(page).nth(index);
}

function getFirstRowNameCell(page: Page) {
  return getRow(page, 0).locator('td.mat-column-name');
}

function getExpandButton(page: Page, index: number) {
  return getRow(page, index).locator(
    'button[aria-label="expand row"], button[aria-label="collapse row"]',
  );
}

test.describe('Mat table tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[role="tab"]', { hasText: 'Mat Table' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  test('renders expected default columns and footer summary', async ({ page }) => {
    await expect(page.locator('th.mat-column-name')).toContainText('Name');
    await expect(page.locator('th.mat-column-atomic_mass')).toContainText('Atomic Mass');
    await expect(page.locator('th.mat-column-symbol')).toContainText('Symbol');
    await expect(page.locator('th[aria-label="row actions"]')).toBeAttached();

    await expect(page.locator('td.mat-column-name.mat-mdc-footer-cell')).toContainText(
      'Total # of elements:',
    );
    const totalText =
      (await page.locator('td.mat-column-atomic_mass.mat-mdc-footer-cell').textContent()) ?? '';
    const total = parseInt(totalText.trim(), 10);
    expect(total).toBeGreaterThan(100);
  });

  test('does not expand a row when the row body is clicked', async ({ page }) => {
    const hydrogenRow = getRow(page, 0);
    await expect(hydrogenRow).toContainText('Hydrogen');
    await expect(hydrogenRow).not.toHaveClass(/example-expanded-row/);

    await getFirstRowNameCell(page).click();

    await expect(hydrogenRow).not.toHaveClass(/example-expanded-row/);
    await expect(page.locator('div.example-element-detail-wrapper-expanded')).toHaveCount(0);
  });

  test('uses the expand icon button to toggle row details and icon state', async ({ page }) => {
    const expandButton = getExpandButton(page, 0);
    await expect(expandButton.locator('mat-icon')).toHaveAttribute(
      'fontIcon',
      'keyboard_arrow_down',
    );
    await expect(expandButton).toHaveAttribute('aria-label', 'expand row');
    await expandButton.click();
    await expect(expandButton.locator('mat-icon')).toHaveAttribute('fontIcon', 'keyboard_arrow_up');
    await expect(expandButton).toHaveAttribute('aria-label', 'collapse row');
    await expandButton.click();
    await expect(expandButton.locator('mat-icon')).toHaveAttribute(
      'fontIcon',
      'keyboard_arrow_down',
    );
    await expect(expandButton).toHaveAttribute('aria-label', 'expand row');
  });

  test('allows only one expanded row at a time', async ({ page }) => {
    await getExpandButton(page, 0).click();
    await expect(getRow(page, 0)).toHaveClass(/example-expanded-row/);

    await getExpandButton(page, 1).click();
    await expect(getRow(page, 0)).not.toHaveClass(/example-expanded-row/);
    await expect(getRow(page, 1)).toHaveClass(/example-expanded-row/);
  });

  test('sorts by name column in both directions', async ({ page }) => {
    await expect(getFirstRowNameCell(page)).toContainText('Hydrogen');
    await expect(getRow(page, 1).locator('td.mat-column-name')).toContainText('Helium');

    await page.locator('th.mat-column-name').click();
    await expect(getFirstRowNameCell(page)).toContainText('Actinium');
    await expect(getRow(page, 1).locator('td.mat-column-name')).toContainText('Aluminium');

    await page.locator('th.mat-column-name').click();
    await expect(getFirstRowNameCell(page)).toContainText('Zirconium');
    await expect(getRow(page, 1).locator('td.mat-column-name')).toContainText('Zinc');
  });

  test('changes page size using paginator options', async ({ page }) => {
    await expect(getDataRows(page)).toHaveCount(25);
    await page.locator('mat-paginator .mat-mdc-paginator-touch-target').click();
    await page.getByRole('option', { name: '5', exact: true }).click();
    await expect(getDataRows(page)).toHaveCount(5);
  });

  test('changes current page when next button is clicked', async ({ page }) => {
    await expect(getFirstRowNameCell(page)).toContainText('Hydrogen');
    await page.locator('.mat-mdc-paginator-navigation-next').click();
    await expect(getFirstRowNameCell(page)).toContainText('Iron');
  });

  test('filters rows case-insensitively with trimmed input and resets paginator to first page', async ({
    page,
  }) => {
    await page.locator('.mat-mdc-paginator-navigation-next').click();
    await expect(getFirstRowNameCell(page)).toContainText('Iron');

    await page.locator('input[matinput]').fill('  zInc  ');
    await expect(page.locator('.mat-mdc-paginator-range-label')).toContainText('of 1');
    await expect(getFirstRowNameCell(page)).toContainText('Zinc');

    await page.locator('input[matinput]').clear();
    await expect(getFirstRowNameCell(page)).toContainText('Hydrogen');
  });

  test('supports selecting displayed columns from the column chooser', async ({ page }) => {
    await page.locator('[data-testid="column-chooser-trigger"]').click();
    const atomicMassCheckbox = page.locator('.cdk-overlay-container mat-checkbox', {
      hasText: 'Atomic Mass',
    });
    await expect(atomicMassCheckbox).toBeVisible();
    await atomicMassCheckbox.click();

    await expect(page.locator('th.mat-column-atomic_mass')).not.toBeAttached();
    await expect(page.locator('td.mat-column-atomic_mass')).not.toBeAttached();
    await expect(page.locator('th.mat-column-name')).toBeAttached();
  });

  test('restores the selected columns after a reload', async ({ page }) => {
    await page.locator('[data-testid="column-chooser-trigger"]').click();
    const appearanceCheckbox = page.locator('.cdk-overlay-container mat-checkbox', {
      hasText: 'Appearance',
    });
    await expect(appearanceCheckbox).toBeVisible();
    await appearanceCheckbox.click();
    await expect(page.locator('th.mat-column-appearance')).toBeAttached();

    await page.reload();

    await expect(page.locator('th.mat-column-appearance')).toBeAttached();
    await expect(page.locator('th.mat-column-name')).toBeAttached();
  });

  test('restores a resized column width after a reload', async ({ page }) => {
    const nameHeader = page.locator('th.mat-column-name');
    await expect(nameHeader).toHaveCSS('width', '150px');

    // The resize handle is keyboard operable and moves in fixed 16px steps.
    await nameHeader.locator('.column-resize-handle').focus();
    await page.keyboard.press('ArrowRight');
    await expect(nameHeader).toHaveCSS('width', '166px');

    await page.reload();

    await expect(page.locator('th.mat-column-name')).toHaveCSS('width', '166px');
  });
});
