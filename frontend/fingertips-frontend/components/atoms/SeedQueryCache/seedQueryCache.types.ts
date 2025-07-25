import {
  Area,
  AreaType,
  AreaWithRelations,
  IndicatorWithHealthDataForArea,
  QuartileData,
} from '@/generated-sources/ft-api-client';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { GeoJSON } from 'highcharts';

export type SeedableData =
  | AreaType[]
  | AreaWithRelations
  | IndicatorWithHealthDataForArea
  | Area[]
  | IndicatorDocument
  | QuartileData[]
  | GeoJSON;

export type SeedData = Record<string, SeedableData>;
export type SeedDataPromises = Record<string, Promise<SeedableData>>;
