import { BenchmarkTooltipArea } from '@/components/atoms/BenchmarkTooltipArea';
import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
  HealthDataForArea,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import {
  getBenchmarkColour,
  sortHealthDataPointsByDescendingYear,
} from '@/lib/chartHelpers/chartHelpers';
import {
  getAreaTitle,
  getBenchmarkSymbol,
  getComparisonString,
  getValueString,
} from './ThematicMapTooltipHelpers';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { SymbolsEnum } from '@/lib/chartHelpers/pointFormatterHelper';
import { GovukColours } from '@/lib/styleHelpers/colours';

interface BenchmarkTooltipProps {
  indicatorData: HealthDataForArea;
  benchmarkComparisonMethod: BenchmarkComparisonMethod;
  measurementUnit: string | undefined;
  englandData?: HealthDataForArea;
  groupData?: HealthDataForArea;
  polarity: IndicatorPolarity;
  benchmarkToUse?: string;
}

export function ThematicMapTooltip({
  indicatorData,
  benchmarkComparisonMethod,
  measurementUnit,
  englandData,
  groupData,
  polarity,
  benchmarkToUse,
}: Readonly<BenchmarkTooltipProps>) {
  const BenchmarkData =
    benchmarkToUse === areaCodeForEngland ? englandData : groupData;
  const nonBenchmarkData =
    benchmarkToUse === areaCodeForEngland ? groupData : englandData;

  const mostRecentDataPointForArea = sortHealthDataPointsByDescendingYear(
    indicatorData.healthData
  )[0];
  const mostRecentDataForNonBenchmark =
    nonBenchmarkData?.healthData.filter(
      (area) => area.year === mostRecentDataPointForArea?.year
    )[0] ?? undefined;
  const mostRecentDataForBenchmark =
    BenchmarkData?.healthData.filter(
      (area) => area.year === mostRecentDataPointForArea?.year
    )[0] ?? undefined;

  const comparisonTextForArea = getComparisonString(
    mostRecentDataPointForArea?.benchmarkComparison?.outcome ?? undefined,
    'area',
    mostRecentDataPointForArea?.benchmarkComparison?.benchmarkAreaName,
    benchmarkComparisonMethod || BenchmarkComparisonMethod.Unknown
  );
  const comparisonTextForNonBenchmark =
    nonBenchmarkData?.areaCode !== areaCodeForEngland
      ? getComparisonString(
          mostRecentDataForNonBenchmark?.benchmarkComparison?.outcome,
          'nonBenchmark',
          mostRecentDataForNonBenchmark?.benchmarkComparison?.benchmarkAreaName,
          benchmarkComparisonMethod || BenchmarkComparisonMethod.Unknown
        )
      : undefined;

  const valueStringForArea = getValueString(
    mostRecentDataPointForArea?.value,
    measurementUnit
  );
  const valueStringForNonBenchmark = getValueString(
    mostRecentDataForNonBenchmark?.value,
    measurementUnit
  );
  const valueStringForBenchmark = getValueString(
    mostRecentDataForBenchmark?.value,
    measurementUnit
  );

  const symbolForArea = getBenchmarkSymbol(
    mostRecentDataPointForArea?.benchmarkComparison?.outcome,
    benchmarkComparisonMethod
  );
  const symbolForNonBenchmark =
    nonBenchmarkData?.areaCode === areaCodeForEngland &&
    mostRecentDataForNonBenchmark!
      ? SymbolsEnum.Circle
      : getBenchmarkSymbol(
          mostRecentDataForNonBenchmark?.benchmarkComparison?.outcome,
          benchmarkComparisonMethod
        );
  const symbolForBenchmark = mostRecentDataForBenchmark?.value
    ? SymbolsEnum.Circle
    : SymbolsEnum.MultiplicationX;

  const symbolColourForArea = getBenchmarkColour(
    benchmarkComparisonMethod,
    mostRecentDataPointForArea?.benchmarkComparison?.outcome ??
      BenchmarkOutcome.NotCompared,
    polarity
  ) as GovukColours;
  const symbolColourForNonBenchmark =
    nonBenchmarkData?.areaCode === areaCodeForEngland
      ? GovukColours.Pink
      : (getBenchmarkColour(
          benchmarkComparisonMethod,
          mostRecentDataForNonBenchmark?.benchmarkComparison?.outcome ??
            BenchmarkOutcome.NotCompared,
          polarity
        ) as GovukColours);

  const titleForBenchmark =
    BenchmarkData && getAreaTitle(BenchmarkData.areaName, 'benchmark');
  const titleForNonBenchMark =
    nonBenchmarkData && getAreaTitle(nonBenchmarkData.areaName, 'nonBenchmark');
  const titleForArea = getAreaTitle(indicatorData.areaName, 'area');

  return (
    <div>
      {BenchmarkData && titleForBenchmark ? (
        <BenchmarkTooltipArea
          titleText={titleForBenchmark}
          year={mostRecentDataForBenchmark?.year}
          valueText={valueStringForBenchmark}
          symbol={symbolForBenchmark}
          symbolColour={GovukColours.Black}
        />
      ) : null}
      {nonBenchmarkData && titleForNonBenchMark ? (
        <BenchmarkTooltipArea
          titleText={titleForNonBenchMark}
          year={mostRecentDataPointForArea?.year}
          valueText={valueStringForNonBenchmark}
          comparisonText={comparisonTextForNonBenchmark}
          symbol={symbolForNonBenchmark}
          symbolColour={symbolColourForNonBenchmark}
        />
      ) : null}

      <BenchmarkTooltipArea
        titleText={titleForArea}
        year={mostRecentDataPointForArea?.year}
        valueText={valueStringForArea}
        comparisonText={comparisonTextForArea}
        symbol={symbolForArea}
        symbolColour={symbolColourForArea}
      />
    </div>
  );
}
