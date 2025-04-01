import {
  HealthDataForArea,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { SearchStateParams } from '@/lib/searchStateManager';

export type OneIndicatorViewPlotProps = {
  searchState: SearchStateParams;
  indicatorData: IndicatorWithHealthDataForArea;
  indicatorMetadata?: IndicatorDocument;
  populationHealthDataForArea?: HealthDataForArea[];
};

export type TwoOrMoreIndicatorsViewPlotProps = {
  searchState: SearchStateParams;
  indicatorData: IndicatorWithHealthDataForArea[];
  indicatorMetadata: IndicatorDocument[];
  groupAreaCode?: string;
};
