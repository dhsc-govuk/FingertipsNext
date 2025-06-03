import { getAreaTitle } from '@/components/molecules/ThematicMapTooltip/ThematicMapTooltipHelpers';
import { formatNumber } from '@/lib/numberFormatter';

export type TooltipType = 'area' | 'benchmark' | 'group';

interface BenchmarkTooltipArea {
  areaName: string;
  year: number | undefined;
  value: number | undefined;
  measurementUnit: string | undefined;
  tooltipType: TooltipType;
  comparisonText?: string;

  // mostRecentDataPoint: HealthDataPoint;
  // // indicatorData: HealthDataForArea;
  // benchmarkComparisonMethod: BenchmarkComparisonMethod;
  // measurementUnit: string | undefined;
  // polarity: IndicatorPolarity;
}

export function BenchmarkTooltipArea({
  areaName,
  year,
  value,
  measurementUnit,
  comparisonText,
  // mostRecentDataPoint,
  // benchmarkComparisonMethod,
  // measurementUnit,
  tooltipType,
  // polarity,
}: Readonly<BenchmarkTooltipArea>) {
  // const benchmarkArea =
  //   mostRecentDataPoint?.benchmarkComparison?.benchmarkAreaName ?? 'England'; // DHSCFT-858 remove this fallback?
  // const benchmarkOutcome =
  //   mostRecentDataPoint?.benchmarkComparison?.outcome ??
  //   BenchmarkOutcome.NotCompared;

  // const areaMarkerSymbol = getAreaMarkerSymbol(
  //   mostRecentDataPoint,
  //   benchmarkComparisonMethod
  // );

  // let benchmarkColour: string | undefined = GovukColours.Black;
  // if (
  //   tooltipType !== 'benchmark' &&
  //   mostRecentDataPoint?.benchmarkComparison?.outcome
  // ) {
  //   benchmarkColour = getBenchmarkColour(
  //     benchmarkComparisonMethod,
  //     benchmarkOutcome ?? BenchmarkOutcome.NotCompared,
  //     polarity
  //   );
  // }

  // TODO: DHSCFT-858: reinstate this logic
  // if (
  //   tooltipType === 'group' &&
  //   indicatorData.areaCode === areaCodeForEngland
  // ) {
  //   benchmarkColour = GovukColours.Pink;
  // }

  // TODO: refactor to use styled components

  return (
    <div
      data-testid={'benchmark-tooltip-area'} // TODO: change this name?
      style={{ marginBlock: '10px', textWrap: 'wrap' }}
    >
      <div>
        <b>{getAreaTitle(areaName, tooltipType)}</b>
        <p style={{ marginBlock: 0 }}>{year}</p>
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
            // color: benchmarkColour,
            display: 'flex',
            marginLeft: '5px',
            gap: '0.5em',
            fontSize: '24px',
          }}
        >
          {/* {areaMarkerSymbol()} */}
        </div>

        <div style={{ marginTop: '5px' }}>
          <span style={{ display: 'block' }}>
            {value ? formatNumber(value) : 'No data available'}{' '}
            {value ? measurementUnit : null}
          </span>
          {tooltipType !== 'benchmark'
            ? comparisonText
            : // getComparisonText(
              //     benchmarkArea,
              //     benchmarkComparisonMethod,
              //     mostRecentDataPoint?.benchmarkComparison?.outcome ?? undefined
              //   )
              null}
        </div>
      </div>
    </div>
  );
}
