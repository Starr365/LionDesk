import { test, expect } from '@playwright/test';

test.describe('Staff Specialist Flow E2E Tests', () => {
  test('should login as staff and view active workload queue', async ({ page }) => {
    // 1. Visit Login
    await page.goto('/login');
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
    await page.fill('input[type="email"]', 'charles.uzo.staff@unn.edu.ng');
    await page.fill('input[type="password"]', 'staff123');
    await page.click('button[type="submit"]');

    // 2. Confirm Dashboard View (using Faculty Staff roleName with increased loading timeout)
    await expect(page.locator('text=Faculty Staff')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('text=Active Workload').first()).toBeVisible();

    // 3. Check stats display
    await expect(page.locator('text=Total Assigned')).toBeVisible();
    await expect(page.locator('text=Resolved').first()).toBeVisible();
  });
});
