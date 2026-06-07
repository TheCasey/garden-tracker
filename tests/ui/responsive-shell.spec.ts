import { expect, test } from '@playwright/test';

test.describe('responsive-shell', () => {
  test('shows the desktop sidebar at wider widths and captures evidence', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');

    await expect(page.getByTestId('sidebar')).toBeVisible();
    await expect(page.getByLabel('Weather summary')).toBeVisible();

    await page.screenshot({ path: 'test-results/phase-5-desktop.png', fullPage: true });
  });

  test('hides the sidebar below the mobile breakpoint and captures evidence', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    await expect(page.getByRole('tab', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByTestId('sidebar')).toBeHidden();
    await expect(page.getByLabel('Weather summary')).toBeHidden();

    await page.getByRole('tab', { name: 'Plant' }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Plant' })).toBeVisible();

    await page.screenshot({ path: 'test-results/phase-5-mobile.png', fullPage: true });
  });
});
