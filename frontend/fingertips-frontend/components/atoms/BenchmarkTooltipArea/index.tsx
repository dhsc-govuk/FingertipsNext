import {
  HealthDataForArea,
  BenchmarkComparisonMethod,
  IndicatorPolarity,
  BenchmarkOutcome,
} from '@/generated-sources/ft-api-client';
import {
  getBenchmarkColour,
  getConfidenceLimitNumber,
  getIndicatorDataForAreasForMostRecentYearOnly,
} from '@/lib/chartHelpers/chartHelpers';
import { SymbolsEnum } from '@/lib/chartHelpers/pointFormatterHelper';
import { formatNumber } from '@/lib/numberFormatter';
import { GovukColours } from '@/lib/styleHelpers/colours';

type TooltipType = 'area' | 'benchmark' | 'group';

interface BenchmarkTooltipArea {
  indicatorData: HealthDataForArea;
  benchmarkComparisonMethod: BenchmarkComparisonMethod;
  measurementUnit: string | undefined;
  tooltipType: TooltipType;
}

export function BenchmarkTooltipArea({
  indicatorData,
  benchmarkComparisonMethod,
  measurementUnit,
  tooltipType,
}: Readonly<BenchmarkTooltipArea>) {
  const indicatorDataForAreaForMostRecentYear =
    getIndicatorDataForAreasForMostRecentYearOnly([indicatorData]);
  const polarity =
    indicatorDataForAreaForMostRecentYear?.[0].healthData[0].benchmarkComparison
      ?.indicatorPolarity ?? IndicatorPolarity.Unknown;
  const benchmarkArea =
    indicatorDataForAreaForMostRecentYear?.[0].healthData[0].benchmarkComparison
      ?.benchmarkAreaName ?? 'England';
  const benchmarkOutcome =
    indicatorDataForAreaForMostRecentYear?.[0].healthData[0].benchmarkComparison
      ?.outcome ?? BenchmarkOutcome.NotCompared;

  const areaMarkerSymbol = () => {
    switch (true) {
      case tooltipType === 'benchmark':
        return SymbolsEnum.Circle;
      case !indicatorDataForAreaForMostRecentYear?.[0].healthData[0]
        ?.benchmarkComparison?.outcome:
        return SymbolsEnum.MultiplicationX;
      case benchmarkComparisonMethod === BenchmarkComparisonMethod.Unknown:
      case benchmarkOutcome === BenchmarkOutcome.NotCompared:
        return SymbolsEnum.WhiteCircle;
      default:
        return SymbolsEnum.Circle;
    }
  };

  let benchmarkColour = getBenchmarkColour(
    benchmarkComparisonMethod,
    benchmarkOutcome ?? BenchmarkOutcome.NotCompared,
    polarity
  );
  if (
    tooltipType === 'benchmark' ||
    !indicatorDataForAreaForMostRecentYear?.[0].healthData[0]
      ?.benchmarkComparison?.outcome
  ) {
    benchmarkColour = GovukColours.Black;
  }

  return (
    <div data-testid={'benchmark-tooltip-area'} style={{ marginBlock: '10px' }}>
      <div style={{ textWrap: 'wrap' }}>
        <b>{getAreaTitle(indicatorData.areaName, tooltipType)}</b>
        <p style={{ marginBlock: 0 }}>
          {indicatorData.healthData[0]?.year ?? null}
        </p>
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
            {indicatorDataForAreaForMostRecentYear?.[0].healthData[0]?.value
              ? formatNumber(
                  indicatorDataForAreaForMostRecentYear[0].healthData[0].value
                )
              : 'No data available'}{' '}
            {indicatorDataForAreaForMostRecentYear?.[0].healthData[0]?.value
              ? measurementUnit
              : null}
          </span>
          {tooltipType !== 'benchmark'
            ? getComparisionText(
                benchmarkArea,
                benchmarkComparisonMethod,
                indicatorDataForAreaForMostRecentYear?.[0].healthData[0]
                  ?.benchmarkComparison?.outcome ?? undefined
              )
            : null}
        </div>
      </div>
    </div>
  );
}

function getComparisionText(
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
      {benchmarkConfidenceLimit ? (
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
      return `Group: ${areaName}`;

    default:
      return areaName;
  }
}
