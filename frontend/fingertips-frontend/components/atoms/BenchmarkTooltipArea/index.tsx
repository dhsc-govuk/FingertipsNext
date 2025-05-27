import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
  HealthDataForArea,
  HealthDataPoint,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import {
  getBenchmarkColour,
  getConfidenceLimitNumber,
  sortHealthDataPointsByDescendingYear,
} from '@/lib/chartHelpers/chartHelpers';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { SymbolsEnum } from '@/lib/chartHelpers/pointFormatterHelper';
import { formatNumber } from '@/lib/numberFormatter';
import { GovukColours } from '@/lib/styleHelpers/colours';

type TooltipType = 'area' | 'benchmark' | 'group';

interface BenchmarkTooltipArea {
  indicatorData: HealthDataForArea;
  benchmarkComparisonMethod: BenchmarkComparisonMethod;
  measurementUnit: string | undefined;
  tooltipType: TooltipType;
  polarity: IndicatorPolarity;
}

export function BenchmarkTooltipArea({
  indicatorData,
  benchmarkComparisonMethod,
  measurementUnit,
  tooltipType,
  polarity,
}: Readonly<BenchmarkTooltipArea>) {
  const indicatorDataForAreaForMostRecentYear =
    sortHealthDataPointsByDescendingYear(indicatorData.healthData);
  const mostRecentDataPoint = indicatorDataForAreaForMostRecentYear[0];
  const benchmarkArea =
    mostRecentDataPoint?.benchmarkComparison?.benchmarkAreaName ?? 'England';
  const benchmarkOutcome =
    mostRecentDataPoint?.benchmarkComparison?.outcome ??
    BenchmarkOutcome.NotCompared;

  const areaMarkerSymbol = getAreaMarkerSymbol(
    tooltipType,
    mostRecentDataPoint,
    benchmarkComparisonMethod,
    indicatorData.areaCode === areaCodeForEngland
  );

  let benchmarkColour = getBenchmarkColour(
    benchmarkComparisonMethod,
    benchmarkOutcome ?? BenchmarkOutcome.NotCompared,
    polarity
  );
  if (
    tooltipType === 'benchmark' ||
    !mostRecentDataPoint?.benchmarkComparison?.outcome
  ) {
    benchmarkColour = GovukColours.Black;
  }

  return (
    <div
      data-testid={'benchmark-tooltip-area'}
      style={{ marginBlock: '10px', textWrap: 'wrap' }}
    >
      <div>
        <b>{getAreaTitle(indicatorData.areaName, tooltipType)}</b>
        <p style={{ marginBlock: 0 }}>{mostRecentDataPoint?.year ?? null}</p>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5em',
        }}
      >
        <div
          style={{
            color: benchmarkColour,
            display: 'flex',
            marginLeft: '5px',
            gap: '0.5em',
            fontSize: '24px',
          }}
        >
          {areaMarkerSymbol()}
        </div>

        <div style={{ marginTop: '5px' }}>
          <span style={{ display: 'block' }}>
            {mostRecentDataPoint?.value
              ? formatNumber(mostRecentDataPoint.value)
              : 'No data available'}{' '}
            {mostRecentDataPoint?.value ? measurementUnit : null}
          </span>
          {tooltipType !== 'benchmark'
            ? getComparisonText(
                benchmarkArea,
                benchmarkComparisonMethod,
                mostRecentDataPoint?.benchmarkComparison?.outcome ?? undefined
              )
            : null}
        </div>
      </div>
    </div>
  );
}

function getAreaMarkerSymbol(
  tooltipType: string,
  mostRecentDataPoint: HealthDataPoint,
  benchmarkComparisonMethod: string,
  EnglandIsGroup: boolean
) {
  return () => {
    switch (true) {
      case tooltipType === 'benchmark':
        return SymbolsEnum.Circle;
      case !mostRecentDataPoint?.benchmarkComparison?.outcome &&
        !EnglandIsGroup:
        return SymbolsEnum.MultiplicationX;
      case benchmarkComparisonMethod === BenchmarkComparisonMethod.Unknown:
      case mostRecentDataPoint.benchmarkComparison?.outcome ===
        BenchmarkOutcome.NotCompared:
        return SymbolsEnum.WhiteCircle;
      default:
        return SymbolsEnum.Circle;
    }
  };
}

function getComparisonText(
  benchmarkArea: string,
  benchmarkComparisonMethod: BenchmarkComparisonMethod,
  benchmarkOutcome?: BenchmarkOutcome
) {
  const benchmarkConfidenceLimit = getConfidenceLimitNumber(
    benchmarkComparisonMethod
  );

  const comparisonText = () => {
    switch (true) {
      case !benchmarkOutcome:
        return null;
      case benchmarkComparisonMethod === BenchmarkComparisonMethod.Quintiles:
        return `${benchmarkOutcome} quintile`;
      case benchmarkComparisonMethod === BenchmarkComparisonMethod.Unknown:
      case benchmarkOutcome === BenchmarkOutcome.NotCompared:
        return `Not compared`;
      case benchmarkOutcome === BenchmarkOutcome.Similar:
        return `${benchmarkOutcome} to ${benchmarkArea}`;

      default:
        return `${benchmarkOutcome} than ${benchmarkArea}`;
    }
  };

  return (
    <>
      <span style={{ display: 'block' }}>{comparisonText()}</span>
      {benchmarkConfidenceLimit && benchmarkArea !== 'England' ? (
        <span style={{ display: 'block' }}>({benchmarkConfidenceLimit}%)</span>
      ) : null}
    </>
  );
}

function getAreaTitle(areaName: string, tooltipType: TooltipType) {
  switch (tooltipType) {
    case 'benchmark':
      return `Benchmark: ${areaName}`;
    case 'group':
      return areaName !== 'England' ? `Group: ${areaName}` : areaName;
    default:
      return areaName;
  }
}
