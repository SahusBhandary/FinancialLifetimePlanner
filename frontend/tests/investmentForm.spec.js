const { test, expect } = require('@playwright/test');

test('Navigate to InvestmentForm and validate form submission', async ({ page }) => {
    // Navigate to the Planning page
     await page.goto('http://localhost:3000/#/planning'); 

    // Click the right arrow to navigate to the InvestmentForm
    await page.click('svg[data-testid="ArrowForwardIosIcon"]'); 

    // Verify that the InvestmentForm is now visible
    await expect(page.locator('text=Investment Type')).toBeVisible();

    await page.fill('.MuiTextField-root:has(label:has-text("Name")) input', 'Test Investment');

    // Fill in the Description field
    await page.fill('.MuiTextField-root:has(label:has-text("Description")) input', 'This is a test investment description.');

    // Select the Expected Annual Return option
    await page.click('[data-testid="annual-return-select"]');

    // Select the "Fixed" option
    await page.click('text=Fixed');

    // Fill in the Fixed Amount for Expected Annual Return
    await page.fill('[data-testid="fixed-return-amount-input"] input', '1000');

    // Fill in the Expense Ratio
    await page.fill('[data-testid="expense-ratio-input"] input', '1.5');

    // Open the Expected Annual Income dropdown
    await page.click('[data-testid="annual-income-select"]');

    // Wait for the dropdown options to be visible
    await page.waitForSelector('[role="option"]', { state: 'visible' });

    // Select the "Fixed" option
    await page.locator('[role="option"]:has-text("Fixed")').click();

    // Fill in the Fixed Amount for Expected Annual Income
    await page.fill('[data-testid="fixed-income-amount-input"] input', '500');

    // Select the Taxability option
    await page.click('input[value="taxable"]'); 

    // Click the Create button
    await page.click('button:has-text("Create")');


  // Verify that the form submission was successful
  await expect(page).toHaveURL('http://localhost:3000/#/planning'); 
});

test('Navigate to InvestmentForm and validate form errors', async ({ page }) => {
    // Navigate to the Planning page
    await page.goto('http://localhost:3000/#/planning');
  
    // Click the right arrow to navigate to the InvestmentForm
    await page.click('svg[data-testid="ArrowForwardIosIcon"]'); 
  
    // Verify that the InvestmentForm is now visible
    await expect(page.locator('text=Investment Type')).toBeVisible(); 
    
    // Open the Expected annual return select
    await page.click('[data-testid="annual-return-select"]');

    // Wait for the dropdown options to be visible
    await page.waitForSelector('[role="option"]', { state: 'visible' });

    // Select the "Fixed" option
    await page.locator('[role="option"]:has-text("Fixed")').click();

    // Open the Expected Annual Income dropdown
    await page.click('[data-testid="annual-income-select"]');

    // Wait for the dropdown options to be visible
    await page.waitForSelector('[role="option"]', { state: 'visible' });

    // Select the "Fixed" option
    await page.locator('[role="option"]:has-text("Fixed")').click();

    // Click the Create button without filling in any fields
    await page.click('button:has-text("Create")');
  
    // Wait for validation errors to appear
    await page.waitForSelector('text=Investment name is required', { state: 'visible' });
  
    // Verify that the validation errors are displayed
    await expect(page.locator('text=Investment name is required')).toBeVisible();
    await expect(page.locator('text=Description is required.')).toBeVisible();
    await expect(page.locator('text=Please enter a value for fixed return')).toBeVisible();
    await expect(page.locator('text=Expense ratio must be a percentage value between 0% and 100%.')).toBeVisible();
    await expect(page.locator('text=Please enter a value for fixed income amount')).toBeVisible();
    await expect(page.locator('text=Taxability status is required.')).toBeVisible();
  });