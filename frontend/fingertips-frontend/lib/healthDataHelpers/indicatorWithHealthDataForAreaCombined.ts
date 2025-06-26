import { IndicatorWithHealthDataForArea } from '@/generated-sources/ft-api-client';
import { filterDefined } from '@/lib/chartHelpers/filterDefined';

export const indicatorWithHealthDataForAreaCombined = (
  data: IndicatorWithHealthDataForArea[]
) => {
  const indicatorsById = Object.groupBy(data, (data) =>
    String(data.indicatorId)
  );

  const indicators = Object.values(indicatorsById).map((items) => {
    if (!items) return;
    return {
      ...items[0],
      areaHealthData: items.flatMap(({ areaHealthData }) => areaHealthData),
    };
  });

  return indicators.filter(filterDefined) as IndicatorWithHealthDataForArea[];
};
