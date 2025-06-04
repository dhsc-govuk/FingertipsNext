import { BenchmarkTooltipArea } from '@/components/atoms/BenchmarkTooltipArea';
import {
  BenchmarkComparisonMethod,
  HealthDataForArea,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import { sortHealthDataPointsByDescendingYear } from '@/lib/chartHelpers/chartHelpers';
import { getComparisonString } from './ThematicMapTooltipHelpers';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';

interface BenchmarkTooltipProps {
  indicatorData: HealthDataForArea;
  benchmarkComparisonMethod: BenchmarkComparisonMethod;
  measurementUnit: string | undefined;
  indicatorDataForComparator: HealthDataForArea;
  polarity: IndicatorPolarity;
}

export function ThematicMapTooltip({
  indicatorData,
  benchmarkComparisonMethod,
  measurementUnit,
  indicatorDataForComparator,
  polarity, // TODO: use this prop to determine the colour of the area symbols
}: Readonly<BenchmarkTooltipProps>) {
  const mostRecentDataPointForArea = sortHealthDataPointsByDescendingYear(
    indicatorData.healthData
  )[0];

  const mostRecentDataPointForGroup =
    indicatorDataForComparator?.healthData.filter(
      (area) => area.year === mostRecentDataPointForArea?.year
    )[0] ?? undefined;

  const comparisonTextForArea = getComparisonString(
    benchmarkComparisonMethod || BenchmarkComparisonMethod.Unknown,
    mostRecentDataPointForArea?.benchmarkComparison?.outcome ?? undefined,
    mostRecentDataPointForArea?.benchmarkComparison?.benchmarkAreaName
  );
  const comparisonTextForGroup =
    indicatorDataForComparator?.areaCode !== areaCodeForEngland
      ? getComparisonString(
          benchmarkComparisonMethod || BenchmarkComparisonMethod.Unknown,
          mostRecentDataPointForGroup?.benchmarkComparison?.outcome,
          mostRecentDataPointForGroup?.benchmarkComparison?.benchmarkAreaName
        )
      : undefined;

  return (
    <div style={{ width: 185, fontSize: '16px' }}>
      {mostRecentDataPointForArea?.benchmarkComparison?.benchmarkAreaName ? (
        <BenchmarkTooltipArea
          areaName={
            mostRecentDataPointForArea.benchmarkComparison?.benchmarkAreaName
          }
          year={mostRecentDataPointForArea.year ?? undefined}
          value={mostRecentDataPointForArea.benchmarkComparison?.benchmarkValue}
          measurementUnit={measurementUnit}
          tooltipType={'benchmark'}
        />
      ) : null}
      <BenchmarkTooltipArea
        areaName={indicatorDataForComparator?.areaName} // TODO: how to fallback if no group data?
        year={mostRecentDataPointForArea?.year ?? undefined}
        value={mostRecentDataPointForGroup?.value}
        measurementUnit={measurementUnit}
        comparisonText={comparisonTextForGroup}
        tooltipType={'comparator'}
      />
      <BenchmarkTooltipArea
        areaName={indicatorData.areaName}
        year={mostRecentDataPointForArea?.year ?? undefined}
        value={mostRecentDataPointForArea?.value ?? undefined}
        measurementUnit={measurementUnit}
        comparisonText={comparisonTextForArea}
        tooltipType={'area'}
      />
    </div>
  );
}
