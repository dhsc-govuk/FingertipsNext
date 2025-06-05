import { BenchmarkTooltipArea } from '@/components/atoms/BenchmarkTooltipArea';
import {
  BenchmarkComparisonMethod,
  HealthDataForArea,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import { sortHealthDataPointsByDescendingYear } from '@/lib/chartHelpers/chartHelpers';
import {
  getAreaTitle,
  getBenchmarkSymbol,
  getComparisonString,
  getValueString,
} from './ThematicMapTooltipHelpers';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { SymbolsEnum } from '@/lib/chartHelpers/pointFormatterHelper';

interface BenchmarkTooltipProps {
  indicatorData: HealthDataForArea;
  benchmarkComparisonMethod: BenchmarkComparisonMethod;
  measurementUnit: string | undefined;
  indicatorDataForBenchmark?: HealthDataForArea;
  indicatorDataForComparator?: HealthDataForArea;
  polarity: IndicatorPolarity;
}

export function ThematicMapTooltip({
  indicatorData,
  benchmarkComparisonMethod,
  measurementUnit,
  indicatorDataForBenchmark,
  indicatorDataForComparator,
  // polarity, // TODO: use this prop to determine the colour of the area symbols
}: Readonly<BenchmarkTooltipProps>) {
  const mostRecentDataPointForArea = sortHealthDataPointsByDescendingYear(
    indicatorData.healthData
  )[0];
  const mostRecentDataPointForComparator =
    indicatorDataForComparator?.healthData.filter(
      (area) => area.year === mostRecentDataPointForArea?.year
    )[0] ?? undefined;
  const mostRecentDataPointForBenchmark =
    indicatorDataForBenchmark?.healthData.filter(
      (area) => area.year === mostRecentDataPointForArea?.year
    )[0] ?? undefined;

  const comparisonTextForArea = getComparisonString(
    mostRecentDataPointForArea?.benchmarkComparison?.outcome ?? undefined,
    'area',
    mostRecentDataPointForArea?.benchmarkComparison?.benchmarkAreaName,
    benchmarkComparisonMethod || BenchmarkComparisonMethod.Unknown
  );
  const comparisonTextForComparator =
    indicatorDataForComparator?.areaCode !== areaCodeForEngland
      ? getComparisonString(
          mostRecentDataPointForComparator?.benchmarkComparison?.outcome,
          'comparator',
          mostRecentDataPointForComparator?.benchmarkComparison
            ?.benchmarkAreaName,
          benchmarkComparisonMethod || BenchmarkComparisonMethod.Unknown
        )
      : undefined;

  const valueStringForArea = getValueString(
    mostRecentDataPointForArea?.value,
    measurementUnit
  );

  const valueStringForComparator = getValueString(
    mostRecentDataPointForComparator?.value,
    measurementUnit
  );

  const valueStringForBenchmark = getValueString(
    mostRecentDataPointForBenchmark?.value,
    measurementUnit
  );

  return (
    <div style={{ width: 185, fontSize: '16px' }}>
      {indicatorDataForBenchmark ? (
        <BenchmarkTooltipArea
          titleText={getAreaTitle(
            indicatorDataForBenchmark.areaName,
            'benchmark'
          )}
          year={mostRecentDataPointForBenchmark?.year ?? undefined}
          valueText={valueStringForBenchmark}
          symbol={
            mostRecentDataPointForBenchmark?.value
              ? SymbolsEnum.Circle
              : SymbolsEnum.MultiplicationX
          }
        />
      ) : null}
      {indicatorDataForComparator ? (
        <BenchmarkTooltipArea
          titleText={getAreaTitle(
            indicatorDataForComparator?.areaName,
            'comparator'
          )}
          year={mostRecentDataPointForArea?.year ?? undefined}
          valueText={valueStringForComparator}
          comparisonText={comparisonTextForComparator}
          symbol={getBenchmarkSymbol(
            mostRecentDataPointForComparator?.benchmarkComparison?.outcome,
            benchmarkComparisonMethod
          )}
        />
      ) : null}

      <BenchmarkTooltipArea
        titleText={getAreaTitle(indicatorData.areaName, 'area')}
        year={mostRecentDataPointForArea?.year ?? undefined}
        valueText={valueStringForArea}
        comparisonText={comparisonTextForArea}
        symbol={getBenchmarkSymbol(
          mostRecentDataPointForArea?.benchmarkComparison?.outcome,
          benchmarkComparisonMethod
        )}
      />
    </div>
  );
}
