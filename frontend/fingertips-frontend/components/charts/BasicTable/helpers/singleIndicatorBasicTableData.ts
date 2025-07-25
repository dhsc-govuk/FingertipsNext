import { BasicTableData } from '@/components/charts/BasicTable/basicTable.types';
import { sortHealthDataPointsByDescendingYear } from '@/lib/chartHelpers/chartHelpers';
import { segmentName } from '@/lib/healthDataHelpers/segmentName';
import { filterDefined } from '@/lib/chartHelpers/filterDefined';
import {
  Frequency,
  HealthDataForArea,
} from '@/generated-sources/ft-api-client';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { indicatorSegmentsSorted } from '@/lib/healthDataHelpers/indicatorSegmentsSorted';
import { formatDatePointLabel } from '@/lib/timePeriodHelpers/getTimePeriodLabels';

export const singleIndicatorBasicTableData = (
  area: HealthDataForArea,
  indicatorMetaData: IndicatorDocument,
  frequency: Frequency
): BasicTableData[] | null => {
  const { indicatorSegments = [] } = area;
  const sortedSegments = indicatorSegmentsSorted(indicatorSegments);

  return sortedSegments
    .map((segment) => {
      const byDatePeriod = sortHealthDataPointsByDescendingYear(
        segment.healthData
      );
      const point = byDatePeriod.at(0);
      const segName = segmentName(segment);

      if (!point) return;

      const { count, value, trend, datePeriod } = point;
      const data: BasicTableData = {
        indicatorId: Number(indicatorMetaData.indicatorID),
        indicatorName: `${indicatorMetaData.indicatorName} (${segName})`,
        period: formatDatePointLabel(datePeriod, frequency, 1),
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
