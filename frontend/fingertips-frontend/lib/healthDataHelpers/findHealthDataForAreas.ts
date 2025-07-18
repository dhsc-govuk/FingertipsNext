import { filterDefined } from '@/lib/chartHelpers/filterDefined';
import {
  HealthDataForArea,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import { findHealthDataForArea } from '@/lib/healthDataHelpers/findHealthDataForArea';

export const findHealthDataForAreas = (
  indicator: IndicatorWithHealthDataForArea,
  areas: string[]
) => {
  return areas
    .map((areaCode) => findHealthDataForArea(indicator, areaCode))
    .filter(filterDefined) as HealthDataForArea[];
};
