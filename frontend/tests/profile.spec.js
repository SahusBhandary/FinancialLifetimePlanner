const { test, expect } = require('@playwright/test');


test.describe('Profile Page Functionality (Not Logged In)', () => {
  test.beforeEach(async ({ page }) => {
    // Inject a mock StoreContext with no user (not logged in)
    await page.addInitScript(() => {
      window.__mockStoreContext = {
        user: null, // Simulate no user
      };
    });

    // Navigate to the profile page
    await page.goto('http://localhost:3000/#/profile');
  });

  test('Displays login message when not logged in', async ({ page }) => {
    // Verify the login message is displayed
    await expect(
      page.locator(
        'text=You are not logged in. Your current scenarios and uploaded files will not save. Please login to view the user profile page.'
      )
    ).toBeVisible();

  });

  test('Redirects to login page when clicking the login button', async ({ page }) => {
    // Click the "Login" button
    await page.click('text=Login');

    // Verify the user is redirected to the login page
    const url = page.url();
    expect(url).toBe('http://localhost:3000/#/login');
  });
});

// ADD A LOGGED IN TEST CASE (difficult to do because of useContext issues)