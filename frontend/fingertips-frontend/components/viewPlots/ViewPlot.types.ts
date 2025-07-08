import {
  Area,
  IndicatorWithHealthDataForArea,
  QuartileData,
} from '@/generated-sources/ft-api-client';
import { IndicatorDocument } from '@/lib/search/searchTypes';

export type TwoOrMoreIndicatorsViewPlotProps = {
  indicatorData: IndicatorWithHealthDataForArea[];
  indicatorMetadata: IndicatorDocument[];
  benchmarkStatistics: QuartileData[];
  availableAreas?: Area[];
};
