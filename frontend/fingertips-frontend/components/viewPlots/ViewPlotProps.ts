import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { SearchStateParams } from '@/lib/searchStateManager';

export type OneIndicatorViewPlotProps = {
  searchState: SearchStateParams;
  healthIndicatorData: HealthDataForArea[];
  indicatorMetadata?: IndicatorDocument;
};

export type MultiIndicatorViewPlotProps = {
  searchState: SearchStateParams;
  healthIndicatorData: HealthDataForArea[][];
  indicatorMetadata?: IndicatorDocument[];
};