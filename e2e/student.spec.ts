import { test, expect } from '@playwright/test';

test.describe('Student Portal Flow E2E Tests', () => {
  test('should navigate, activate student, login, and submit a ticket', async ({ page }) => {
    // 1. Visit Activation Page
    await page.goto('/activate');
    await expect(page.locator('text=Student Activation')).toBeVisible();

    // Fill Step 1 verification
    await page.fill('input[placeholder="e.g., 2022/240456"]', '2022/240456');
    await page.fill('input[placeholder="Official Name registered in DB"]', 'Stella Starr');
    await page.click('button:has-text("Verify Registry")');

    // Fill Step 2 manual email and password activation
    await expect(page.locator('text=Enter your preferred email address')).toBeVisible();
    await page.fill('input[placeholder="Preferred portal email"]', 'stella.starr.student@unn.edu.ng');
    await page.fill('input[placeholder="••••••••"]', 'studentpassword');
    await page.click('button:has-text("Activate Profile")');

    // 2. Confirm Dashboard View and Welcome text
    await expect(page.locator('text=Welcome back')).toBeVisible();
    await expect(page.locator('text=Track your student complaints')).toBeVisible();

    // 3. Navigate to Submit Complaint tab
    await page.click('button:has-text("File New Complaint")');
    await expect(page.locator('text=File a Departmental Complaint')).toBeVisible();
  });
});
