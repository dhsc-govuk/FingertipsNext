import { IndicatorWithHealthDataForArea } from '@/generated-sources/ft-api-client';

export const indicatorsSorted = (
  indicators: IndicatorWithHealthDataForArea[]
) => indicators.toSorted((a, b) => (a.name ?? '').localeCompare(b.name ?? ''));
