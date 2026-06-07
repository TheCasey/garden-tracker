import { expect, test } from '@playwright/test';

test.describe('plant-detail', () => {
  test('Cherry Tomatoes detail shows height, near-yield status, and care metrics', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');

    await page.getByTestId('sidebar').getByRole('button', { name: /Cherry Tomatoes/ }).click();

    await expect(page.getByTestId('view-plant')).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Cherry Tomatoes' })).toBeVisible();
    await expect(page.getByTestId('plant-detail-subtitle')).toContainText(
      'Ground Plot · 6 ft · Near yield · x2',
    );
    await expect(page.getByTestId('care-normal-watering')).toContainText('2 days');
    await expect(page.getByTestId('care-dry-watering')).toContainText('1 day');
    await expect(page.getByTestId('care-fertilizing')).toContainText('2 wks');
    await expect(page.getByTestId('care-moisture-depth')).toContainText('2 in');
    await expect(page.getByTestId('care-days-to-maturity')).toContainText('80 days');

    await page.screenshot({ path: 'test-results/phase-7-plant-detail-desktop.png', fullPage: true });
  });

  test('switching from Cherry Tomatoes to Strawberry swaps detail state and syncs the sidebar', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');

    const cherrySidebarItem = page
      .getByTestId('sidebar')
      .getByRole('button', { name: /Cherry Tomatoes/ });
    const strawberrySidebarItem = page
      .getByTestId('sidebar')
      .getByRole('button', { name: /Strawberry/ });

    await cherrySidebarItem.click();
    await expect(page.getByRole('heading', { level: 2, name: 'Cherry Tomatoes' })).toBeVisible();
    await expect(cherrySidebarItem).toHaveAttribute('aria-current', 'true');

    await strawberrySidebarItem.click();

    await expect(page.getByRole('heading', { level: 2, name: 'Strawberry' })).toBeVisible();
    await expect(page.getByTestId('plant-detail-subtitle')).toContainText(
      'Container Zone · Stagnant container plant · Stagnant · x1',
    );
    await expect(page.getByTestId('care-days-to-maturity')).toContainText('75 days');
    await expect(page.getByText('High-security isolation setup to prevent ground critter consumption.'))
      .toBeVisible();
    await expect(cherrySidebarItem).not.toHaveAttribute('aria-current', 'true');
    await expect(strawberrySidebarItem).toHaveAttribute('aria-current', 'true');
    await expect(page.getByRole('heading', { level: 2, name: 'Cherry Tomatoes' })).toHaveCount(0);
  });

  test('mobile back returns to Dashboard without losing the selected plant', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    await page.getByTestId('plant-row-strawberry').click();

    await expect(page.getByTestId('view-plant')).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Strawberry' })).toBeVisible();

    await page.getByRole('button', { name: 'Back to dashboard' }).click();

    await expect(page.getByTestId('view-dashboard')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1, name: 'Dashboard' })).toBeVisible();
    await expect(page.getByTestId('plant-row-strawberry')).toHaveAttribute('data-selected', 'true');

    await page.getByRole('tab', { name: 'Plant' }).click();
    await expect(page.getByRole('heading', { level: 2, name: 'Strawberry' })).toBeVisible();

    await page.screenshot({ path: 'test-results/phase-7-plant-detail-mobile.png', fullPage: true });
  });
});
