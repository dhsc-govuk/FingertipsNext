import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
  HealthDataForArea,
} from '@/generated-sources/ft-api-client';
import {
  AreaTypeLabelEnum,
  getTooltipContent,
} from '@/lib/chartHelpers/chartHelpers';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { pointFormatterHelper } from '@/lib/chartHelpers/pointFormatterHelper';
import { formatNumber } from '@/lib/numberFormatter';

const generateTooltipData = (
  indicatorData: HealthDataForArea[],
  groupData?: HealthDataForArea,
  benchmarkData?: HealthDataForArea
): HealthDataForArea[] => {
  const tooltipData = [...indicatorData];

  if (groupData)
    tooltipData.push({
      ...groupData,
    });

  if (benchmarkData)
    tooltipData.push({
      ...benchmarkData,
    });

  return tooltipData;
};

const getBenchmarkOutcomeForYear = (
  year: number,
  areaCode: string,
  chartData: HealthDataForArea[]
) => {
  return chartData
    .find((healthData) => healthData.areaCode === areaCode)
    ?.healthData.find((point) => point.year === year)?.benchmarkComparison
    ?.outcome;
};

function generateAreaLineChartTooltipForPoint(
  tooltipData: HealthDataForArea[],
  benchmarkComparisonMethod?: BenchmarkComparisonMethod,
  measurementUnit?: string
) {
  return (point: Highcharts.Point, symbol: string) => {
    const areaCode: string = point.series.options.custom?.areaCode ?? '';

    const label =
      areaCode === areaCodeForEngland
        ? AreaTypeLabelEnum.Benchmark
        : AreaTypeLabelEnum.Area;

    const { benchmarkLabel, category, comparisonLabel } = getTooltipContent(
      getBenchmarkOutcomeForYear(point.x, areaCode, tooltipData) ??
        BenchmarkOutcome.NotCompared,
      label,
      benchmarkComparisonMethod ?? BenchmarkComparisonMethod.Unknown
    );

    const formatValueUnit = (valueUnit?: string) => {
      switch (valueUnit) {
        case undefined:
          return '';
        case '%':
          return valueUnit;
        default:
          return ` ${valueUnit}`;
      }
    };

    return [
      `
      <div style="padding-right: 25px">
        <span style="display: block; font-weight: bold">${category}${point.series.name}</span>
        <span style="display: block;>${point.x}</span>
        <div style="display: flex; margin-top: 15px; align-items: center;">
          <div style="margin-right: 10px;"><span style="color: ${point.series.color}; font-weight: bold;">${symbol}</span></div>
          <div style="padding-right: 10px;">
            <span style="display: block;">${formatNumber(point.y)}${formatValueUnit(measurementUnit)}</span>
            ${!benchmarkLabel ? '' : '<span style="display: block;">' + benchmarkLabel + '</span>'}
            ${!comparisonLabel ? '' : '<span style="display: block;">' + comparisonLabel + '</span>'}
          </div>
        </div>
      </div>`,
    ];
  };
}

export function generateTooltip(
  areasHealthIndicatorData: HealthDataForArea[],
  benchmarkIndicatorData?: HealthDataForArea,
  groupIndicatorData?: HealthDataForArea,
  benchmarkComparisonMethod?: BenchmarkComparisonMethod,
  measurementUnit?: string
): Highcharts.TooltipOptions {
  const tooltipData = generateTooltipData(
    areasHealthIndicatorData,
    groupIndicatorData,
    benchmarkIndicatorData
  );

  return {
    headerFormat: '',
    formatter: function (this: Highcharts.Point): string {
      return pointFormatterHelper(
        this,
        generateAreaLineChartTooltipForPoint(
          tooltipData,
          benchmarkComparisonMethod,
          measurementUnit
        )
      );
    },
    useHTML: true,
  };
}
