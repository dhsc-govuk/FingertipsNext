import { IndicatorDocument } from '@/lib/search/searchTypes';
import AxeBuilder from '@axe-core/playwright';
import { expect } from './page-objects/pageFactory';
import { Page } from '@playwright/test';
function filterIndicatorsByName(
  indicators: IndicatorDocument[],
  searchTerm: string
): IndicatorDocument[] {
  if (!searchTerm) return [];
  const normalizedSearchTerm = searchTerm.toLowerCase();
  return indicators.filter((indicator) =>
    indicator.name.toLowerCase().includes(normalizedSearchTerm)
  );
}
export function getIndicatorIdsByName(
  indicators: IndicatorDocument[],
  searchTerm: string
): string[] {
  return filterIndicatorsByName(indicators, searchTerm).map(
    (indicator) => indicator.indicatorId
  );
}
export async function expectNoAccessibilityViolations(axeBuilder: AxeBuilder) {
  expect((await axeBuilder.analyze()).violations).toEqual([]);
}

export async function compareFullPageSnapshot(page: Page, fileName: string) {
  await expect(page).toHaveScreenshot(`${fileName}.png`);
}

export async function compareElementSnapshot(page: Page, chartTestId: string, fileName: string) {
  const selector = `[data-testid="${chartTestId}"]`
  const element = await page.locator(selector);
  await expect(element).toBeVisible();
  await element.screenshot({ path: `debug-&{fileName}.png`});
  await expect(element).toHaveScreenshot(`test-snapshots/${fileName}.png`);
}
