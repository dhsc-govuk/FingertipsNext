import { inequalitiesData } from '@/components/charts/Inequalities/helpers/inequalitiesData';
import { SearchStateParams } from '@/lib/searchStateManager';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { IndicatorWithHealthDataForArea } from '@/generated-sources/ft-api-client';
import { ChartType } from '@/components/charts/Inequalities/helpers/inequalitiesHelpers';

export const inequalitiesTrendData = (
  searchState: SearchStateParams,
  indicatorMetaData?: IndicatorDocument,
  healthData?: IndicatorWithHealthDataForArea
) => {
  const data = inequalitiesData(
    searchState,
    indicatorMetaData,
    healthData,
    ChartType.Trend
  );
  if (!data) return null;

  return data;
};
