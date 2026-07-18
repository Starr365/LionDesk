import { test, expect } from '@playwright/test';

test.describe('Staff Specialist Flow E2E Tests', () => {
  test('should login as staff and view active workload queue', async ({ page }) => {
    // 1. Visit Login
    await page.goto('/login');
    await page.fill('input[type="email"]', 'charles.uzo.staff@unn.edu.ng');
    await page.fill('input[type="password"]', 'staff123');
    await page.click('button[type="submit"]');

    // 2. Confirm Dashboard View
    await expect(page.locator('text=Staff Specialist')).toBeVisible();
    await expect(page.locator('text=Active Workload')).toBeVisible();

    // 3. Check stats display
    await expect(page.locator('text=Total Assigned')).toBeVisible();
    await expect(page.locator('text=Resolved')).toBeVisible();
  });
});
