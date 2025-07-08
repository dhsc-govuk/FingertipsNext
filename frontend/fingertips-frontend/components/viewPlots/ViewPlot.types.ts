import {
  Area,
  IndicatorWithHealthDataForArea,
  QuartileData,
} from '@/generated-sources/ft-api-client';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { Session } from 'next-auth';

export type OneIndicatorViewPlotProps = {
  indicatorData: IndicatorWithHealthDataForArea;
  session: Session | null;
};

export type TwoOrMoreIndicatorsViewPlotProps = {
  indicatorData: IndicatorWithHealthDataForArea[];
  indicatorMetadata: IndicatorDocument[];
  benchmarkStatistics: QuartileData[];
  availableAreas?: Area[];
};
