import { HealthDataForArea, IndicatorWithHealthDataForArea } from '@/generated-sources/ft-api-client';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { SearchStateParams } from '@/lib/searchStateManager';

export type ViewPlotProps = {
  indicatorData: IndicatorWithHealthDataForArea;
  searchState: SearchStateParams;
  indicatorMetadata?: IndicatorDocument;
  populationHealthDataForArea?: HealthDataForArea[];
};

export type MultiIndicatorViewPlotProps = {
  searchState: SearchStateParams;
  healthIndicatorData: HealthDataForArea[][];
  indicatorMetadata?: IndicatorDocument[];
};