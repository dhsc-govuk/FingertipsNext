import { IndicatorWithHealthDataForArea } from '@/generated-sources/ft-api-client';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { SearchStateParams } from '@/lib/searchStateManager';

export type OneIndicatorViewPlotProps = {
  indicatorData: IndicatorWithHealthDataForArea;
  searchState: SearchStateParams;
  indicatorMetadata?: IndicatorDocument;
};

export type TwoOrMoreIndicatorsAreasViewPlot = {
  indicatorData: IndicatorWithHealthDataForArea[];
  searchState: SearchStateParams;
  indicatorMetadata?: IndicatorDocument[];
};
