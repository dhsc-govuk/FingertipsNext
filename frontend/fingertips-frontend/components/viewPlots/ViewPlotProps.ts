import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { SearchStateParams } from '@/lib/searchStateManager';

export type ViewPlotProps = {
  healthIndicatorData: HealthDataForArea[];
  searchState: SearchStateParams;
  indicatorMetadata?: IndicatorDocument;
};

export type MultiIndicatorViewPlotProps = {
  searchState: SearchStateParams;
  healthIndicatorData: HealthDataForArea[];
  groupIndicatorData: HealthDataForArea[];
  englandIndicatorData: HealthDataForArea[];
  indicatorMetadata: (IndicatorDocument | undefined)[];
};