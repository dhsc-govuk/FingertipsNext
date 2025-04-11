import {
  Area,
  IndicatorWithHealthDataForArea,
  QuartileData,
} from '@/generated-sources/ft-api-client';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { SearchStateParams } from '@/lib/searchStateManager';

export type OneIndicatorViewPlotProps = {
  searchState: SearchStateParams;
  indicatorData: IndicatorWithHealthDataForArea;
  indicatorMetadata?: IndicatorDocument;
  availableAreas?: Area[];
};

export type TwoOrMoreIndicatorsViewPlotProps = {
  searchState: SearchStateParams;
  indicatorData: IndicatorWithHealthDataForArea[];
  indicatorMetadata: IndicatorDocument[];
  benchmarkStatistics: QuartileData[];
  availableAreas?: Area[];
};
