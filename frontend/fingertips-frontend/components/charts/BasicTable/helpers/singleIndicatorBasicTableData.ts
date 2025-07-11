import { BasicTableData } from '@/components/charts/BasicTable/basicTable.types';
import { sortHealthDataPointsByDescendingYear } from '@/lib/chartHelpers/chartHelpers';
import { segmentName } from '@/lib/healthDataHelpers/segmentName';
import { filterDefined } from '@/lib/chartHelpers/filterDefined';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { IndicatorDocument } from '@/lib/search/searchTypes';

export const singleIndicatorBasicTableData = (
  area: HealthDataForArea,
  indicatorMetaData: IndicatorDocument
): BasicTableData[] | null => {
  const { indicatorSegments = [] } = area;
  const sortedSegments = indicatorSegments.toSorted((a, b) => {
    const aSex = a.sex.value;
    const bSex = b.sex.value;
    const compareSex = bSex.localeCompare(aSex);
    if (compareSex !== 0) return compareSex;
    // compare other segmentation options when they are available
    return 0;
  });

  return sortedSegments
    .map((segment) => {
      const byYear = sortHealthDataPointsByDescendingYear(segment.healthData);
      const point = byYear.at(0);
      const segName = segmentName(segment);

      if (!point) return;

      const { count, value, trend } = point;
      const data: BasicTableData = {
        indicatorId: Number(indicatorMetaData.indicatorID),
        indicatorName: `${indicatorMetaData.indicatorName} (${segName})`,
        period: indicatorMetaData.latestDataPeriod,
        unitLabel: indicatorMetaData.unitLabel,
        areaName: area.areaName,
        areaCode: area.areaCode,
        count,
        value,
        trend,
      };

      return data;
    })
    .filter(filterDefined) as BasicTableData[];
};
