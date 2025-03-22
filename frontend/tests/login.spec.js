const { test, expect } = require('@playwright/test');

//can't simulate the google authentication, so using a mock to make sure that the page works
test.describe('Login Page Functionality (Frontend)', () => {
  test('Login button redirects to Google OAuth', async ({ page }) => {
    await page.route('http://localhost:8000/auth/google', (route) => {
      console.log('Mocking Google OAuth redirect');
      route.fulfill({
        status: 302,
        headers: {
          Location: 'http://localhost:8000/auth/google/callback?code=mock-code',
        },
      });
    });

    // Navigate to the login page
    await page.goto('http://localhost:3000/#/login');

    // Wait for the "Continue With Google" button to be visible
    await page.waitForSelector('text=Continue With Google', { state: 'visible', timeout: 10000 });

    // Click the "Continue With Google" button
    await page.click('text=Continue With Google');

    // Verify the redirect URL
    const url = page.url();
    expect(url).toBe('http://localhost:8000/auth/google/callback?code=mock-code');
  });
});