import { test, expect } from '@playwright/test';

test('Search Page via indicator and assert results', async ({ page }) => {
  // Arrange
  const indicator = '123';
  await page.goto('search');

  // Assert
  await expect(page).toHaveURL(/search/);

  // Act
  await page
    .locator('[data-testid="search-form-input-indicator"]')
    .fill(indicator);
  await page.locator('[data-testid="search-form-button-submit"]').click();

  // Assert
  const resultsText = 'You searched for indicator';
  await expect(page).toHaveURL(`search/results?indicator=${indicator}`);
  await expect(page.getByText(`${resultsText} "${indicator}"`)).toBeVisible();
});
