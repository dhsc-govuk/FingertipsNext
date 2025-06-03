import { BenchmarkTooltipArea } from '@/components/atoms/BenchmarkTooltipArea';
import {
  BenchmarkComparisonMethod,
  HealthDataForArea,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import { sortHealthDataPointsByDescendingYear } from '@/lib/chartHelpers/chartHelpers';
import { getComparisonString } from './ThematicMapTooltipHelpers';

interface BenchmarkTooltipProps {
  indicatorData: HealthDataForArea;
  benchmarkComparisonMethod: BenchmarkComparisonMethod;
  measurementUnit: string | undefined;
  indicatorDataForGroup?: HealthDataForArea;
  polarity: IndicatorPolarity;
}

export function ThematicMapTooltip({
  indicatorData,
  benchmarkComparisonMethod,
  measurementUnit,
  indicatorDataForGroup,
  polarity,
}: Readonly<BenchmarkTooltipProps>) {
  const mostRecentDataPointForArea = sortHealthDataPointsByDescendingYear(
    indicatorData.healthData
  )[0];

  const mostRecentDataPointForGroup = sortHealthDataPointsByDescendingYear(
    indicatorDataForGroup?.healthData
  )[0];

  const comparisonTextForArea = getComparisonString(
    mostRecentDataPointForArea.benchmarkComparison?.benchmarkAreaName || ``,
    benchmarkComparisonMethod || BenchmarkComparisonMethod.Unknown,
    mostRecentDataPointForArea.benchmarkComparison?.outcome
  );

  const comparisonTextForGroup = getComparisonString(
    mostRecentDataPointForGroup.benchmarkComparison?.benchmarkAreaName || ``,
    benchmarkComparisonMethod || BenchmarkComparisonMethod.Unknown,
    mostRecentDataPointForGroup.benchmarkComparison?.outcome
  );

  return (
    <div style={{ width: 185, fontSize: '16px' }}>
      {mostRecentDataPointForArea.benchmarkComparison?.benchmarkAreaName ? (
        <BenchmarkTooltipArea
          areaName={
            mostRecentDataPointForArea.benchmarkComparison?.benchmarkAreaName
          }
          year={mostRecentDataPointForArea.year}
          value={mostRecentDataPointForArea.benchmarkComparison?.benchmarkValue}
          measurementUnit={measurementUnit}
          tooltipType={'benchmark'}
        />
      ) : null}
      {indicatorDataForGroup ? (
        <BenchmarkTooltipArea
          areaName={indicatorDataForGroup.areaName}
          year={mostRecentDataPointForGroup.year}
          value={mostRecentDataPointForGroup.value}
          measurementUnit={measurementUnit}
          comparisonText={comparisonTextForGroup}
          tooltipType={'group'}
        />
      ) : null}
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
