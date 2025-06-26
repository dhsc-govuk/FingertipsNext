import {
  Area,
  AreaType,
  AreaWithRelations,
  IndicatorWithHealthDataForArea,
  QuartileData,
} from '@/generated-sources/ft-api-client';
import { IndicatorDocument } from '@/lib/search/searchTypes';

export type SeedData = Record<
  string,
  | AreaType[]
  | AreaWithRelations
  | IndicatorWithHealthDataForArea
  | Area[]
  | IndicatorDocument
  | QuartileData[]
>;
