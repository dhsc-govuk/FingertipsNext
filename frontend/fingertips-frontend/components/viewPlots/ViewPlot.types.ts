import {
  Area,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';

export type OneIndicatorViewPlotProps = {
  indicatorData: IndicatorWithHealthDataForArea;
};

export type TwoOrMoreIndicatorsViewPlotProps = {
  indicatorData: IndicatorWithHealthDataForArea[];
  availableAreas?: Area[];
};
