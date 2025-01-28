import { IndicatorDocument } from '@/lib/search/searchTypes';
import indicatorData from '../../../search-setup/assets/indicatorData.json';

export function getIndicatorIDByName(searchTerm: string): IndicatorDocument[] {
  const typedIndicatorData = indicatorData.map((indicator) => {
    return {
      ...indicator,
      lastUpdated: new Date(indicator.lastUpdated),
    };
  });
  return typedIndicatorData.filter((indicator) =>
    indicator.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
}
