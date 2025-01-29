import { IndicatorDocument } from '@/lib/search/searchTypes';

export function getIndicatorIDByName(
  indicators: IndicatorDocument[],
  searchTerm: string
): IndicatorDocument[] {
  return indicators.filter((indicator) =>
    indicator.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
}
