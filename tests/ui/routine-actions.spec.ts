import { expect, test } from '@playwright/test';

test.describe('routine actions', () => {
  test('watering logs immediately, updates the control, and persists after reload', async ({ page }) => {
    await page.goto('/');

    const geminiRequests: string[] = [];
    page.on('request', (request) => {
      if (/gemini|generativelanguage/i.test(request.url())) {
        geminiRequests.push(request.url());
      }
    });

    const waterButton = page.getByTestId('quick-action-brandywine-tomato-water');
    await expect(waterButton).toContainText('Water');

    await waterButton.click();

    await expect(waterButton).toHaveClass(/is-done/);
    await expect(waterButton).toContainText('Watered');

    await page.getByTestId('plant-card-brandywine-tomato').click();
    await expect(page.getByTestId('view-plant')).toBeVisible();
    await expect(page.getByText('watered today')).toBeVisible();

    await page.reload();
    await expect(page.getByTestId('view-dashboard')).toBeVisible();
    await expect(page.getByTestId('quick-action-brandywine-tomato-water')).toHaveClass(/is-done/);

    expect(geminiRequests).toEqual([]);
  });

  test('harvest requires count input, increments tally, writes a log, and persists', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByTestId('plant-card-green-bean-bush')).toContainText('0 harvested');

    await page.getByTestId('quick-action-green-bean-bush-harvest').click();
    await expect(page.getByTestId('harvest-panel')).toBeVisible();
    await expect(page.getByTestId('harvest-count-input')).toHaveAttribute('required', '');

    await page.getByTestId('harvest-count-input').fill('4');
    await page.getByTestId('harvest-note-input').fill('Evening pass before dinner.');
    await page.getByTestId('harvest-submit').click();

    await expect(page.getByTestId('harvest-panel')).toHaveCount(0);
    await expect(page.getByTestId('plant-card-green-bean-bush')).toContainText('4 harvested');

    await page.getByTestId('plant-card-green-bean-bush').click();
    await expect(page.getByText('4 harvested')).toBeVisible();
    await expect(page.getByText('Evening pass before dinner.')).toBeVisible();

    await page.reload();
    await expect(page.getByTestId('view-dashboard')).toBeVisible();
    await expect(page.getByTestId('plant-card-green-bean-bush')).toContainText('4 harvested');
  });

  test('task checkbox state toggles visually and survives reload', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('tab', { name: 'Tasks' }).click();

    const taskCheckbox = page.getByTestId('task-checkbox-cantaloupe-hammock-support');
    await expect(taskCheckbox).not.toBeChecked();

    await taskCheckbox.check();
    await expect(taskCheckbox).toBeChecked();
    await expect(page.getByTestId('task-item-cantaloupe-hammock-support')).toHaveAttribute(
      'data-state',
      'done',
    );

    await page.reload();
    await page.getByRole('tab', { name: 'Tasks' }).click();
    await expect(page.getByTestId('task-checkbox-cantaloupe-hammock-support')).toBeChecked();
  });

  test('inline note entry writes a plant log without calling AI endpoints', async ({ page }) => {
    const blockedRoutineRequests: string[] = [];
    page.on('request', (request) => {
      if (/gemini|generativelanguage/i.test(request.url())) {
        blockedRoutineRequests.push(request.url());
      }
    });

    await page.goto('/');
    await page.getByTestId('quick-action-brandywine-tomato-log').click();

    await expect(page.getByTestId('view-dashboard')).toBeVisible();
    await expect(page.getByTestId('log-panel')).toBeVisible();

    await page.getByTestId('log-note-input').fill('Pruned two low leaves after watering check.');
    await page.getByTestId('log-submit').click();

    await expect(page.getByTestId('view-plant')).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Brandywine Tomato' })).toBeVisible();
    await expect(page.getByText('manual note')).toBeVisible();
    await expect(page.getByText('Pruned two low leaves after watering check.')).toBeVisible();

    await page.screenshot({ path: 'test-results/phase-8-routine-actions.png', fullPage: true });
    expect(blockedRoutineRequests).toEqual([]);
  });
});
