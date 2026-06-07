import { expect, test } from '@playwright/test';

test.describe('app-shell', () => {
  test('switches between Dashboard, Plant, and Tasks while keeping the hygiene alert visible', async ({
    page,
  }) => {
    await page.goto('/');

    const alert = page.getByRole('alert');
    await expect(alert).toContainText('Canopy zone active.');
    await expect(alert).toContainText('exhaustive wash cycles');

    await expect(page.getByRole('heading', { level: 1, name: 'Dashboard' })).toBeVisible();

    await page.getByRole('tab', { name: 'Plant' }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Plant' })).toBeVisible();
    await expect(alert).toBeVisible();

    await page.getByRole('tab', { name: 'Tasks' }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Tasks' })).toBeVisible();
    await expect(alert).toBeVisible();

    await page.getByRole('tab', { name: 'Dashboard' }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Dashboard' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Dashboard' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  test('shows a visible keyboard focus style on shell controls', async ({ page }) => {
    await page.goto('/');

    const dashboardTab = page.getByRole('tab', { name: 'Dashboard' });
    await dashboardTab.focus();

    const boxShadow = await dashboardTab.evaluate((element) => {
      const typedElement = element as {
        ownerDocument?: {
          defaultView?: {
            getComputedStyle: (target: unknown) => {
              boxShadow?: string;
            };
          } | null;
        };
      };
      const view = typedElement.ownerDocument?.defaultView;
      return view?.getComputedStyle(element).boxShadow ?? 'none';
    });
    expect(boxShadow).not.toBe('none');
    expect(boxShadow).toContain('rgb');
  });
});
