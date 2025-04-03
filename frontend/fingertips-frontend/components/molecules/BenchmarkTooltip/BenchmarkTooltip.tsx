import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
  HealthDataForArea,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import {
  getBenchmarkColour,
  getConfidenceLimitNumber,
  getIndicatorDataForAreasForMostRecentYearOnly,
} from '@/lib/chartHelpers/chartHelpers';
import { symbolEncoder } from '@/lib/chartHelpers/pointFormatterHelper';

interface BenchmarkTooltipProps {
  indicatorDataForArea: HealthDataForArea;
  benchmarkComparisonMethod: BenchmarkComparisonMethod;
  polarity: IndicatorPolarity;
  measurementUnit: string | undefined;
  benchmarkArea: string;
  // Indicator?: TODO: add this to support heatmap tooltip?
}

export function BenchmarkTooltip({
  indicatorDataForArea,
  benchmarkComparisonMethod,
  polarity,
  measurementUnit,
  benchmarkArea,
}: Readonly<BenchmarkTooltipProps>) {
  const benchmarkConfidenceLimit = getConfidenceLimitNumber(
    benchmarkComparisonMethod
  );
  const areaMarkerSymbol =
    indicatorDataForArea.healthData[0].benchmarkComparison?.outcome ===
    BenchmarkOutcome.NotCompared
      ? symbolEncoder.multiplicationX
      : symbolEncoder.circle;
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
              {indicatorDataForAreaForMostRecentYear[0].healthData[0].value}{' '}
              {measurementUnit}
            </span>
            {getComparisionText(
              benchmarkArea,
              indicatorDataForAreaForMostRecentYear[0].healthData[0]
                .benchmarkComparison?.outcome
            )}
            {benchmarkConfidenceLimit ? (
              <span style={{ display: 'block' }}>
                ({benchmarkConfidenceLimit}%)
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function getComparisionText(
  benchmarkArea: string,
  benchmarkOutcome?: BenchmarkOutcome
) {
  // TODO: DHSCFT-518 to handle no data
  if (
    benchmarkOutcome === BenchmarkOutcome.NotCompared ||
    benchmarkOutcome === BenchmarkOutcome.Similar
  ) {
    return (
      <span style={{ display: 'block' }}>
        {benchmarkOutcome} to {benchmarkArea}
      </span>
    );
  }
  return (
    <span style={{ display: 'block' }}>
      {benchmarkOutcome} than {benchmarkArea}
    </span>
  );
}
