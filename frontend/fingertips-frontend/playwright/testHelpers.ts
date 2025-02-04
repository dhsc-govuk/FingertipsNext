import { IndicatorDocument } from '@/lib/search/searchTypes';
import AxeBuilder from '@axe-core/playwright';
import { expect } from './page-objects/pageFactory';

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
