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
// import { symbolEncoder } from '@/lib/chartHelpers/pointFormatterHelper';

type IndicatorDataForTooltip =
  | { indicatorDataForArea: HealthDataForArea }
  | { indicatorDataForBenchmark: HealthDataForArea }
  | { indicatorDataForGroup: HealthDataForArea };

// interface BenchmarkTooltipArea {
//   indicatorDataForTooltip: indicatorDataForTooltip;
//   benchmarkComparisonMethod: BenchmarkComparisonMethod;
//   polarity: IndicatorPolarity;
//   measurementUnit: string | undefined;
//   benchmarkArea: string;
// }

interface BenchmarkTooltipArea {
  indicatorDataForArea: HealthDataForArea;
  benchmarkComparisonMethod: BenchmarkComparisonMethod;
  polarity: IndicatorPolarity;
  measurementUnit: string | undefined;
  benchmarkArea: string;
  indicatorDataForBenchmark?: HealthDataForArea;
  indicatorDataForGroup?: HealthDataForArea;
}

export function BenchmarkTooltipArea({
  indicatorDataForArea,
  benchmarkComparisonMethod,
  polarity,
  measurementUnit,
  benchmarkArea,
}: Readonly<BenchmarkTooltipArea>) {
  const areaMarkerSymbol =
    indicatorDataForArea.healthData[0].benchmarkComparison?.outcome ===
    BenchmarkOutcome.NotCompared
      ? SymbolsEnum.MultiplicationX
      : SymbolsEnum.Circle;

  const indicatorDataForAreaForMostRecentYear =
    getIndicatorDataForAreasForMostRecentYearOnly([indicatorDataForArea]);

  const benchmarkColour = getBenchmarkColour(
    benchmarkComparisonMethod,
    indicatorDataForAreaForMostRecentYear[0].healthData[0].benchmarkComparison
      ?.outcome ?? BenchmarkOutcome.NotCompared,
    polarity
  );

  return (
    <div>
      <div>
        <b>{indicatorDataForArea.areaName}</b>
        <p>{indicatorDataForArea.healthData[0].year}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25em' }}>
          <div
            style={{
              color: benchmarkColour,
              display: 'flex',
              gap: '0.25em',
              fontSize: 'large',
            }}
          >
            {areaMarkerSymbol}
          </div>
          <div>
            <span style={{ display: 'block' }}>
              {formatNumber(
                indicatorDataForAreaForMostRecentYear[0].healthData[0].value
              )}{' '}
              {measurementUnit}
            </span>
            {getComparisionText(
              benchmarkArea,
              benchmarkComparisonMethod,
              indicatorDataForAreaForMostRecentYear[0].healthData[0]
                .benchmarkComparison?.outcome
            )}
          </div>
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
  // TODO: DHSCFT-518 to handle no data
  if (
    benchmarkOutcome === BenchmarkOutcome.NotCompared ||
    benchmarkComparisonMethod === BenchmarkComparisonMethod.Quintiles
  ) {
    return <span style={{ display: 'block' }}>{benchmarkOutcome}</span>;
  }
  if (benchmarkOutcome === BenchmarkOutcome.Similar) {
    return (
      <>
        <span style={{ display: 'block' }}>
          {benchmarkOutcome} to {benchmarkArea}
        </span>
        {benchmarkConfidenceLimit ? (
          <span style={{ display: 'block' }}>
            ({benchmarkConfidenceLimit}%)
          </span>
        ) : null}
      </>
    );
  }
  return (
    <>
      <span style={{ display: 'block' }}>
        {benchmarkOutcome} than {benchmarkArea}
      </span>
      {benchmarkConfidenceLimit ? (
        <span style={{ display: 'block' }}>({benchmarkConfidenceLimit}%)</span>
      ) : null}
    </>
  );
}
