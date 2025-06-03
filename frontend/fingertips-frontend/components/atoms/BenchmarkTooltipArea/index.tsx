import { getAreaTitle } from '@/components/molecules/ThematicMapTooltip/ThematicMapTooltipHelpers';
import { BenchmarkOutcome } from '@/generated-sources/ft-api-client';
import { formatNumber } from '@/lib/numberFormatter';

export type TooltipType = 'area' | 'benchmark' | 'comparator';

interface BenchmarkTooltipArea {
  areaName: string;
  year: number | undefined;
  value: number | BenchmarkOutcome | undefined;
  measurementUnit: string | undefined;
  tooltipType: TooltipType;
  comparisonText?: string;
}

export function BenchmarkTooltipArea({
  areaName,
  year,
  value,
  measurementUnit,
  comparisonText,
  tooltipType,
}: Readonly<BenchmarkTooltipArea>) {
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

  const formatedValue = (() => {
    switch (true) {
      case value === undefined:
        return 'No data available';
      case typeof value === 'number':
        return `${formatNumber(value)}${measurementUnit ? ` ${measurementUnit}` : ''}`;
      case value === BenchmarkOutcome.NotCompared:
        return 'Not compared';
      default:
        return value;
    }
  })();

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
          <span style={{ display: 'block' }}>{formatedValue}</span>
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
