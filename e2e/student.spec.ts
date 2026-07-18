import { test, expect } from '@playwright/test';

test.describe('Student Portal Flow E2E Tests', () => {
  test('should navigate, activate student, login, and submit a ticket', async ({ page }) => {
    // 1. Visit Activation Page
    await page.goto('/activate');
    await expect(page.locator('text=Verification Registry Parameters')).toBeVisible();

    // Fill Step 1 verification
    await page.fill('input[placeholder="Registration Number"]', '2022/240456');
    await page.fill('input[placeholder="Registry Full Name"]', 'Stella Starr');
    await page.click('button:has-text("Verify parameters")');

    // 2. Visit Login Page
    await page.goto('/login');
    await page.fill('input[type="email"]', 'stella.starr.student@unn.edu.ng');
    await page.fill('input[type="password"]', 'studentpassword');
    await page.click('button[type="submit"]');

    // 3. Confirm Dashboard View and Welcome text
    await expect(page.locator('text=Welcome back')).toBeVisible();
    await expect(page.locator('text=Track your student complaints')).toBeVisible();

    // 4. Navigate to Submit Complaint tab
    await page.click('button:has-text("File New Complaint")');
    await expect(page.locator('text=File a Departmental Complaint')).toBeVisible();
  });
});
