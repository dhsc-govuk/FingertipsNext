import {
  DatePeriod,
  Frequency,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import { filterDefined } from '@/lib/chartHelpers/filterDefined';
import { formatDatePointLabel } from '@/lib/timePeriodHelpers/getTimePeriodLabels';
import { allHealthPoints } from '@/lib/healthDataHelpers/allHealthPoints';

export const inequalityDatePeriodOptions = (
  healthData: IndicatorWithHealthDataForArea,
  selectedType?: string
): string[] => {
  const { frequency = Frequency.Annually } = healthData;
  const reportingPeriod = true;

  const allPoints = allHealthPoints(healthData);
  const filteredByType = allPoints.filter(
    (point) => point.deprivation.type === selectedType
  );
  const allPeriods = filteredByType
    .map((point) => point.datePeriod)
    .filter(filterDefined) as DatePeriod[];

  const periodsInOrder = allPeriods.toSorted(
    (a, b) => b.from.getTime() - a.from.getTime()
  );

  const periodLabels = periodsInOrder.map((period) =>
    formatDatePointLabel(period, frequency, reportingPeriod)
  );

  return [...new Set(periodLabels)];
};
