import { test, expect } from '@playwright/test';

//test.describe.configure({ mode: 'parallel' });

test('must default to having the line chart tab selected', async ({ page }) => {
  await page.goto('http://localhost:3000/chart?si=mortality&is=1&as=A1426');

  await expect(page.getByTestId('lineChart-component')).toBeVisible();
  await expect(page.getByTestId('lineChartTable-component')).not.toBeVisible();
});

test('must show line chart and hide table when user clicks on the line chart tab', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/chart?si=mortality&is=1&as=A1426');

  await page.getByRole('link', { name: 'Line Chart' }).click();

  await expect(page.getByTestId('lineChart-component')).toBeVisible();
  await expect(page.getByTestId('lineChartTable-component')).not.toBeVisible();
});

test('must show table and hide line chart when user clicks on the table tab', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/chart?si=mortality&is=1&as=A1426');

  await page.getByRole('link', { name: 'Tabular Data' }).click();

  await expect(page.getByTestId('lineChart-component')).not.toBeVisible();
  await expect(page.getByTestId('lineChartTable-component')).toBeVisible();
});
