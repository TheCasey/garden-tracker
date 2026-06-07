import { expect, test } from '@playwright/test';

test.describe('dashboard', () => {
  test('renders all June 6 plants in the correct zones and captures desktop/mobile evidence', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');

    const groundZone = page.getByTestId('zone-ground-plot');
    const containerZone = page.getByTestId('zone-container-zone');

    for (const plantName of [
      'Cherry Tomatoes',
      'Brandywine Tomato',
      'Beefsteak Tomato',
      'Cucumbers',
      'Squash',
      'Green Bean Bush',
      'Cantaloupe',
      'Marigolds',
    ]) {
      await expect(groundZone.getByLabel(plantName)).toBeVisible();
    }

    for (const plantName of ['Black Tomato', 'Watermelon', 'Peppers', 'Strawberry']) {
      await expect(containerZone.getByLabel(plantName)).toBeVisible();
    }

    await page.screenshot({ path: 'test-results/phase-6-dashboard-desktop.png', fullPage: true });

    await page.setViewportSize({ width: 390, height: 844 });
    await expect(page.getByTestId('dashboard-view')).toBeVisible();
    await page.screenshot({ path: 'test-results/phase-6-dashboard-mobile.png', fullPage: true });
  });

  test('shows deterministic container dryout states', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByTestId('moisture-bar-black-tomato')).toHaveAttribute(
      'data-dryout-state',
      'mid',
    );
    await expect(page.getByTestId('moisture-bar-watermelon')).toHaveAttribute(
      'data-dryout-state',
      'hi',
    );
    await expect(page.getByTestId('moisture-bar-peppers')).toHaveAttribute(
      'data-dryout-state',
      'lo',
    );
  });

  test('clicking a plant opens the selected plant in the existing shell', async ({ page }) => {
    await page.goto('/');

    await page.getByTestId('plant-card-cucumbers').click();

    await expect(page.getByTestId('view-plant')).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Cucumbers' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Plant' })).toHaveAttribute('aria-selected', 'true');
  });

  test('clicking a quick action does not open the plant detail view', async ({ page }) => {
    await page.goto('/');

    await page.getByTestId('quick-action-brandywine-tomato-log').click();

    await expect(page.getByTestId('view-dashboard')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1, name: 'Dashboard' })).toBeVisible();
    await expect(page.getByTestId('plant-card-brandywine-tomato')).toHaveAttribute(
      'data-selected',
      'false',
    );
  });
});
