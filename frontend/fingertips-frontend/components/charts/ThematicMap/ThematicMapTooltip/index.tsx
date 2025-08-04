import { BenchmarkTooltipArea } from '@/components/atoms/BenchmarkTooltipArea';
import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
  DatePeriod,
  Frequency,
  HealthDataForArea,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import { getBenchmarkColour } from '@/lib/chartHelpers/chartHelpers';
import {
  getAreaTitle,
  getBenchmarkSymbol,
  getComparisonString,
  getValueString,
} from './ThematicMapTooltipHelpers';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { SymbolsEnum } from '@/lib/chartHelpers/pointFormatterHelper';
import { GovukColours } from '@/lib/styleHelpers/colours';
import { formatDatePointLabel } from '@/lib/timePeriodHelpers/getTimePeriodLabels';

export interface ThematicMapTooltipProps {
  indicatorData: HealthDataForArea;
  benchmarkComparisonMethod: BenchmarkComparisonMethod;
  measurementUnit: string | undefined;
  frequency: Frequency;
  latestDataPeriod?: DatePeriod;
  englandData?: HealthDataForArea;
  groupData?: HealthDataForArea;
  polarity: IndicatorPolarity;
  benchmarkToUse?: string;
  year: number;
  isSmallestReportingPeriod: boolean;
}

export function ThematicMapTooltip({
  indicatorData,
  benchmarkComparisonMethod,
  measurementUnit,
  frequency,
  latestDataPeriod,
  englandData,
  groupData,
  polarity,
  benchmarkToUse,
  year,
  isSmallestReportingPeriod,
}: Readonly<ThematicMapTooltipProps>) {
  const BenchmarkData =
    benchmarkToUse === areaCodeForEngland ? englandData : groupData;
  const nonBenchmarkData =
    benchmarkToUse === areaCodeForEngland ? groupData : englandData;

  const mostRecentDataPointForArea = indicatorData.healthData.filter(
    (area) => area.year === year
  )[0];
  const mostRecentDataForNonBenchmark =
    nonBenchmarkData?.healthData.filter((area) => area.year === year)[0] ??
    undefined;
  const mostRecentDataForBenchmark =
    BenchmarkData?.healthData.filter((area) => area.year === year)[0] ??
    undefined;

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
  const datePointLabel = formatDatePointLabel(
    latestDataPeriod,
    frequency,
    isSmallestReportingPeriod
  );

  return (
    <div>
      {BenchmarkData && titleForBenchmark ? (
        <BenchmarkTooltipArea
          titleText={titleForBenchmark}
          periodLabel={datePointLabel}
          valueText={valueStringForBenchmark}
          symbol={symbolForBenchmark}
          symbolColour={GovukColours.Black}
        />
      ) : null}
      {nonBenchmarkData && titleForNonBenchMark ? (
        <BenchmarkTooltipArea
          titleText={titleForNonBenchMark}
          periodLabel={datePointLabel}
          valueText={valueStringForNonBenchmark}
          comparisonText={comparisonTextForNonBenchmark}
          symbol={symbolForNonBenchmark}
          symbolColour={symbolColourForNonBenchmark}
        />
      ) : null}

      <BenchmarkTooltipArea
        titleText={titleForArea}
        periodLabel={datePointLabel}
        valueText={valueStringForArea}
        comparisonText={comparisonTextForArea}
        symbol={symbolForArea}
        symbolColour={symbolColourForArea}
      />
    </div>
  );
}
