import { test, expect } from '@playwright/test';

test.describe('Admin HOD Flow E2E Tests', () => {
  test('should login as admin and view full administrative control tabs', async ({ page }) => {
    // 1. Visit Login
    await page.goto('/login');
    await page.fill('input[type="email"]', 'hod.cs@unn.edu.ng');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');

    // 2. Confirm HOD controls display
    await expect(page.locator('text=HOD Administrative Controls')).toBeVisible();
    await expect(page.locator('text=All Tickets')).toBeVisible();

    // 3. Navigate to Manage Staff tab
    await page.click('span:has-text("Manage Staff")');
    await expect(page.locator('text=Staff Workload Specializations')).toBeVisible();

    // 4. Navigate to Reports analytics tab
    await page.click('span:has-text("Reports")');
    await expect(page.locator('text=Ticketing Metrics & Charts')).toBeVisible();
  });
});
