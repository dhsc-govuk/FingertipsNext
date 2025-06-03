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
  indicatorDataForGroup: HealthDataForArea | undefined;
  polarity: IndicatorPolarity;
}

export function ThematicMapTooltip({
  indicatorData,
  benchmarkComparisonMethod,
  measurementUnit,
  indicatorDataForGroup,
  polarity, // TODO: use this prop to determine the colour of the area symbols
}: Readonly<BenchmarkTooltipProps>) {
  const mostRecentDataPointForArea = sortHealthDataPointsByDescendingYear(
    indicatorData.healthData
  )[0];

  const mostRecentDataPointForGroup =
    indicatorDataForGroup?.healthData.filter(
      (area) => area.year === mostRecentDataPointForArea.year
    )[0] ?? undefined;

  const comparisonTextForArea = getComparisonString(
    benchmarkComparisonMethod || BenchmarkComparisonMethod.Unknown,
    mostRecentDataPointForArea.benchmarkComparison?.outcome ?? undefined,
    mostRecentDataPointForArea.benchmarkComparison?.benchmarkAreaName
  );
  const comparisonTextForGroup =
    indicatorDataForGroup?.areaCode !== areaCodeForEngland
      ? getComparisonString(
          benchmarkComparisonMethod || BenchmarkComparisonMethod.Unknown,
          mostRecentDataPointForGroup?.benchmarkComparison?.outcome,
          mostRecentDataPointForGroup?.benchmarkComparison?.benchmarkAreaName
        )
      : undefined;

  return (
    <div style={{ width: 185, fontSize: '16px' }}>
      {mostRecentDataPointForArea.benchmarkComparison?.benchmarkAreaName ? (
        <BenchmarkTooltipArea
          areaName={
            mostRecentDataPointForArea.benchmarkComparison?.benchmarkAreaName
          }
          year={mostRecentDataPointForArea.year}
          value={
            mostRecentDataPointForArea.benchmarkComparison?.benchmarkValue ??
            undefined
          }
          measurementUnit={measurementUnit}
          tooltipType={'benchmark'}
        />
      ) : null}
      <BenchmarkTooltipArea
        areaName={indicatorDataForGroup?.areaName} // TODO: how to fallback if no group data?
        year={mostRecentDataPointForArea.year}
        value={mostRecentDataPointForGroup?.value}
        measurementUnit={measurementUnit}
        comparisonText={comparisonTextForGroup}
        tooltipType={'comparator'}
      />
      <BenchmarkTooltipArea
        areaName={indicatorData.areaName}
        year={mostRecentDataPointForArea.year}
        value={mostRecentDataPointForArea.value}
        measurementUnit={measurementUnit}
        comparisonText={comparisonTextForArea}
        tooltipType={'area'}
      />
    </div>
  );
}
