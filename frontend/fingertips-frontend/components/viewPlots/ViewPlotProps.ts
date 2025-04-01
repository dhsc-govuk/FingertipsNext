import { IndicatorWithHealthDataForArea } from '@/generated-sources/ft-api-client';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { SearchStateParams } from '@/lib/searchStateManager';
import { BenchmarkStatisticsProps } from '../views/TwoOrMoreIndicatorsAreasView';

export type OneIndicatorViewPlotProps = {
  searchState: SearchStateParams;
  indicatorData: IndicatorWithHealthDataForArea;
  indicatorMetadata?: IndicatorDocument;
};

export type TwoOrMoreIndicatorsViewPlotProps = {
  searchState: SearchStateParams;
  indicatorData: IndicatorWithHealthDataForArea[];
  indicatorMetadata: IndicatorDocument[];
  benchmarkStatistics: BenchmarkStatisticsProps[];
};
