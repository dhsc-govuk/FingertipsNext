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
};

export type TwoOrMoreIndicatorsViewPlotProps = {
  searchState: SearchStateParams;
  indicatorData: IndicatorWithHealthDataForArea[];
  indicatorMetadata: IndicatorDocument[];
};

export type MultiIndicatorViewPlotProps = {
  searchState: SearchStateParams;
  healthIndicatorData: HealthDataForArea[];
  groupIndicatorData: HealthDataForArea[];
  englandIndicatorData: HealthDataForArea[];
  indicatorMetadata: (IndicatorDocument | undefined)[];
};

export type TwoOrMoreIndicatorsEnglandViewPlotProps = {
  indicatorData: IndicatorWithHealthDataForArea[];
  searchState: SearchStateParams;
  indicatorMetadata: IndicatorDocument[] | undefined;
};
