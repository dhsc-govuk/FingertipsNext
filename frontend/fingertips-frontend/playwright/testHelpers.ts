import { IndicatorDocument } from '@/lib/search/searchTypes';
import AxeBuilder from '@axe-core/playwright';
import { expect } from './page-objects/pageFactory';
import { IndicatorMode } from './page-objects/pages/chartPage';

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

export function getAllIndicatorIdsForSearchTerm(
  indicators: IndicatorDocument[],
  searchTerm: string
): string[] {
  return filterIndicatorsByName(indicators, searchTerm).map(
    (indicator) => indicator.indicatorId
  );
}

export function returnIndicatorIDsByIndicatorMode(
  indicators: string[],
  indicatorMode: IndicatorMode
): string[] {
  switch (indicatorMode) {
    case IndicatorMode.ONE_INDICATOR:
      return [indicators[0]];
    case IndicatorMode.TWO_INDICATORS:
      return [indicators[0], indicators[1]];
    case IndicatorMode.MULTIPLE_INDICATORS:
      return [indicators[0], indicators[1], indicators[2]];
    default:
      throw new Error('Invalid indicator mode');
  }
}

export async function expectNoAccessibilityViolations(axeBuilder: AxeBuilder) {
  expect((await axeBuilder.analyze()).violations).toEqual([]);
}
