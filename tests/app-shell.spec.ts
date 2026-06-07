import { expect, test } from '@playwright/test';

test('renders the Garden Tracker shell without runtime errors', async ({ page }) => {
  const pageErrors: string[] = [];

  page.on('pageerror', (error) => {
    pageErrors.push(error.message);
  });

  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1, name: 'Garden Tracker' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
  await expect(page.getByText('Vite + React + TypeScript with npm')).toBeVisible();

  expect(pageErrors).toEqual([]);
});
