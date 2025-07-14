import {
  Area,
  IndicatorWithHealthDataForArea,
  QuartileData,
} from '@/generated-sources/ft-api-client';

export type OneIndicatorViewPlotProps = {
  indicatorData: IndicatorWithHealthDataForArea;
};

export type TwoOrMoreIndicatorsViewPlotProps = {
  indicatorData: IndicatorWithHealthDataForArea[];
  benchmarkStatistics: QuartileData[];
  availableAreas?: Area[];
};
