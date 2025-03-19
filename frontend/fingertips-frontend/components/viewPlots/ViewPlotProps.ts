import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { SearchStateParams } from '@/lib/searchStateManager';

export type OneIndicatorViewPlotProps = {
  healthIndicatorData: HealthDataForArea[];
  searchState: SearchStateParams;
  indicatorMetadata?: IndicatorDocument;
};

export type MultiIndicatorViewPlotProps = {
  healthIndicatorData: HealthDataForArea[][];
  searchState: SearchStateParams;
  indicatorMetadata?: IndicatorDocument[];
};