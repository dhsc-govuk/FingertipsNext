import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
  HealthDataForArea,
} from '@/generated-sources/ft-api-client';
import {
  AreaTypeLabelEnum,
  getTooltipContent,
} from '@/lib/chartHelpers/chartHelpers';
import { pointFormatterHelper } from '@/lib/chartHelpers/pointFormatterHelper';
import { formatNumber } from '@/lib/numberFormatter';

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

function generateBenchmarkComparison(
  point: Highcharts.Point,
  areasHealthIndicatorData: HealthDataForArea[],
  benchmarkComparisonMethod?: BenchmarkComparisonMethod
) {
  const areaCode: string = point.series.options.custom?.areaCode ?? '';
  const isSelectedArea = areasHealthIndicatorData.some(
    (area) => area.areaCode === areaCode
  );

  if (isSelectedArea) {
    const { benchmarkLabel, comparisonLabel } = getTooltipContent(
      getBenchmarkOutcomeForYear(point.x, areaCode, areasHealthIndicatorData) ??
      BenchmarkOutcome.NotCompared,
      AreaTypeLabelEnum.Area,
      benchmarkComparisonMethod ?? BenchmarkComparisonMethod.Unknown
    );

    return `
      ${!benchmarkLabel ? '' : '<span style="display: block;">' + benchmarkLabel + '</span>'}
      ${!comparisonLabel ? '' : '<span style="display: block;">' + comparisonLabel + '</span>'}
    `;
  }
  return ``;
}

function generateTooltipPointForSelectedAreas(
  areasHealthIndicatorData: HealthDataForArea[],
  benchmarkComparisonMethod?: BenchmarkComparisonMethod,
  measurementUnit?: string
) {
  return (point: Highcharts.Point, symbol: string) => {
    return [
      `
      <div style="padding-right: 25px">
        <span style="display: block; font-weight: bold">${point.series.name}</span>
        <span style="display: block;>${point.x}</span>
        <div style="display: flex; margin-top: 15px; align-items: center;">
          <div style="margin-right: 10px;"><span style="color: ${point.series.color}; font-weight: bold;">${symbol}</span></div>
          <div style="padding-right: 10px;">
            <span style="display: block;">${formatNumber(point.y)}${formatValueUnit(measurementUnit)}</span>
            ${generateBenchmarkComparison(point, areasHealthIndicatorData, benchmarkComparisonMethod)}
          </div>
        </div>
      </div>`,
    ];
  };
}

export function generateTooltip(
  areasHealthIndicatorData: HealthDataForArea[],
  benchmarkComparisonMethod?: BenchmarkComparisonMethod,
  measurementUnit?: string
): Highcharts.TooltipOptions {
  return {
    headerFormat: '',
    formatter: function (this: Highcharts.Point): string {
      return pointFormatterHelper(
        this,
        generateTooltipPointForSelectedAreas(
          areasHealthIndicatorData,
          benchmarkComparisonMethod,
          measurementUnit
        )
      );
    },
    useHTML: true,
  };
}
