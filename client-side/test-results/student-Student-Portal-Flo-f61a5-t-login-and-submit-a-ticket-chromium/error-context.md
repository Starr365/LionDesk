# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: student.spec.ts >> Student Portal Flow E2E Tests >> should navigate, activate student, login, and submit a ticket
- Location: ..\e2e\student.spec.ts:4:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Enter your preferred email address')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=Enter your preferred email address')

```

```yaml
- status: This registration number has already been activated.
- img
- img
- banner:
  - link "LionDesk":
    - /url: /
  - link "Sign in":
    - /url: /login
  - link "Back to Home":
    - /url: /
- main:
  - heading "Student Activation" [level=2]
  - paragraph: "Step 1: Enter your official registration details to verify registry records."
  - text: Matric / Reg Number
  - textbox "e.g., 2022/240456": 2022/240456
  - text: Full Name
  - textbox "Official Name registered in DB": Stella Starr
  - button "Verify Registry"
  - text: Already activated?
  - link "Log In":
    - /url: /login
- contentinfo:
  - text: Copyright @liondesk 2026
  - link "Privacy Policy":
    - /url: /docs
  - text: "|"
  - link "Terms of Service":
    - /url: /docs
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Student Portal Flow E2E Tests', () => {
  4  |   test('should navigate, activate student, login, and submit a ticket', async ({ page }) => {
  5  |     // 1. Visit Activation Page
  6  |     await page.goto('/activate');
  7  |     await expect(page.locator('text=Student Activation')).toBeVisible();
  8  | 
  9  |     // Fill Step 1 verification
  10 |     await page.fill('input[placeholder="e.g., 2022/240456"]', '2022/240456');
  11 |     await page.fill('input[placeholder="Official Name registered in DB"]', 'Stella Starr');
  12 |     await page.click('button:has-text("Verify Registry")');
  13 | 
  14 |     // Fill Step 2 manual email and password activation
> 15 |     await expect(page.locator('text=Enter your preferred email address')).toBeVisible();
     |                                                                           ^ Error: expect(locator).toBeVisible() failed
  16 |     await page.fill('input[placeholder="Preferred portal email"]', 'stella.starr.student@unn.edu.ng');
  17 |     await page.fill('input[placeholder="••••••••"]', 'studentpassword');
  18 |     await page.click('button:has-text("Activate Profile")');
  19 | 
  20 |     // 2. Confirm Dashboard View and Welcome text
  21 |     await expect(page.locator('text=Welcome back')).toBeVisible();
  22 |     await expect(page.locator('text=Track your student complaints')).toBeVisible();
  23 | 
  24 |     // 3. Navigate to Submit Complaint tab
  25 |     await page.click('button:has-text("File New Complaint")');
  26 |     await expect(page.locator('text=File a Departmental Complaint')).toBeVisible();
  27 |   });
  28 | });
  29 | 
```