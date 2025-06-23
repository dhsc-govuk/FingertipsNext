import { findAndRemoveByAreaCode } from '@/lib/healthDataHelpers/findAndRemoveByAreaCode';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { IndicatorWithHealthDataForArea } from '@/generated-sources/ft-api-client';

export const compareAreasTableData = (
  healthData: IndicatorWithHealthDataForArea,
  selectedGroupCode?: string,
  benchmarkAreaSelected?: string
) => {
  const benchmarkComparisonMethod = healthData?.benchmarkMethod;
  const polarity = healthData?.polarity;

  const [withoutEngland, englandData] = findAndRemoveByAreaCode(
    healthData?.areaHealthData ?? [],
    areaCodeForEngland
  );

  const [withoutEnglandOrGroup, groupData] = findAndRemoveByAreaCode(
    withoutEngland,
    selectedGroupCode
  );

  const benchmarkToUse = benchmarkAreaSelected ?? areaCodeForEngland;

  return {
    benchmarkComparisonMethod,
    polarity,
    healthIndicatorData: withoutEnglandOrGroup,
    groupData,
    englandData,
    benchmarkToUse,
  };
};
