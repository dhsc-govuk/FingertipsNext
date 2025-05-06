import {
  Area,
  AreaType,
  AreaWithRelations,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';

export type SeedData = Record<
  string,
  AreaType[] | AreaWithRelations | IndicatorWithHealthDataForArea | Area[]
>;