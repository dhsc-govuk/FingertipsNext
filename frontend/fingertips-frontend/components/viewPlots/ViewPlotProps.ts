import {
  HealthDataForArea,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { SearchStateParams } from '@/lib/searchStateManager';

export type OneIndicatorViewPlotProps = {
  indicatorData: IndicatorWithHealthDataForArea;
  searchState: SearchStateParams;
  indicatorMetadata?: IndicatorDocument;
  populationHealthDataForArea?: HealthDataForArea[];
};

export type TwoOrMoreIndicatorsAreasViewPlot = {
  indicatorData: IndicatorWithHealthDataForArea[];
  searchState: SearchStateParams;
  indicatorMetadata?: IndicatorDocument[];
};
