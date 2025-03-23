const { test, expect } = require('@playwright/test');

test.describe('UploadScenario Component', () => {
  test('Upload Scenario with a YAML file but not logged in', async ({ page }) => {
    // Mock the API request
    await page.route('http://localhost:8000/import-scenario', (route) => {
      console.log('Mocking import-scenario API call');
      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Scenario imported successfully!',
          scenario: {
            id: 'mock-scenario-id',
            name: 'Mock Scenario',
            userId: 'mock-user-id',
          },
        }),
      });
    });

    // Navigate to the UploadScenario page
    await page.goto('http://localhost:3000/#/uploadScenario');

    // Verify the page title
    await expect(page.locator('h1')).toHaveText('Import Scenario');

    // Verify the file input is visible
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeVisible();

    // Upload a mock YAML file
    await fileInput.setInputFiles({
      name: 'mock-scenario.yaml',
      mimeType: 'application/yaml',
      buffer: Buffer.from('mock yaml content'),
    });

    // Verify the file is selected
    await expect(fileInput).toHaveValue(/mock-scenario.yaml/);

    // Set up a dialog handler to intercept the alert
    let alertMessage = '';
    page.on('dialog', async (dialog) => {
      alertMessage = dialog.message(); 
      await dialog.accept(); 
    });

    // Click the "Import Scenario" button
    await page.click('button:has-text("Import Scenario")');

    // Verify the alert message
    expect(alertMessage).toBe('You must be logged in to import a scenario.');
  });
});