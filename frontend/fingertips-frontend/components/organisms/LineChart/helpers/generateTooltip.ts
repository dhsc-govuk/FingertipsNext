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
import { convertDateToNumber } from '@/lib/timePeriodHelpers/getTimePeriodLabels';

const getBenchmarkForPeriod = (
  dateAsNumber: number,
  areaCode: string,
  chartData: HealthDataForArea[]
) => {
  return chartData
    .find((healthData) => healthData.areaCode === areaCode)
    ?.healthData.find((point) => convertDateToNumber(point.datePeriod?.from) === dateAsNumber)?.benchmarkComparison;
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
  benchmarkToUse: string,
  benchmarkComparisonMethod?: BenchmarkComparisonMethod
) {
  const areaCode: string = point.series.options.custom?.areaCode ?? '';
  const xCategoryKey = point.series.options.custom?.xCategoryKeys[point.x]

  const isSelectedArea = areasHealthIndicatorData.some(
    (area) => area.areaCode === areaCode
  );

  const isEnglandBenchmarkAndNotEnglandArea =
    benchmarkToUse === areaCodeForEngland && areaCode !== areaCodeForEngland;

  const isGroupBenchmarkAndSelectedArea =
    benchmarkToUse !== areaCodeForEngland && isSelectedArea;

  if (isEnglandBenchmarkAndNotEnglandArea || isGroupBenchmarkAndSelectedArea) {
    const benchmarkForYear = getBenchmarkForPeriod(
      xCategoryKey,
      areaCode,
      areasHealthIndicatorData
    );

    const { benchmarkLabel, comparisonLabel } = getTooltipContent(
      benchmarkForYear?.outcome ?? BenchmarkOutcome.NotCompared,
      AreaTypeLabelEnum.Area,
      benchmarkComparisonMethod ?? BenchmarkComparisonMethod.Unknown,
      benchmarkForYear?.benchmarkAreaName
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
  benchmarkToUse: string,
  benchmarkComparisonMethod?: BenchmarkComparisonMethod,
  measurementUnit?: string
) {
  return (point: Highcharts.Point, symbol: string) => {
    const period = point.category;

    return [
      `
      <div style="padding-right: 25px" class="tooltip-point-selector">
        <span style="display: block; font-weight: bold">${point.series.name}</span>
        <span style="display: block;">${period}</span>
        <div style="display: flex; margin-top: 15px; align-items: center;">
          <div style="margin-right: 10px;"><span style="color: ${point.series.color}; font-weight: bold;">${symbol}</span></div>
          <div style="padding-right: 10px;">
            <span style="display: block;">${formatNumber(point.y)}${formatValueUnit(measurementUnit)}</span>
            ${generateBenchmarkComparison(point, areasHealthIndicatorData, benchmarkToUse, benchmarkComparisonMethod)}
          </div>
        </div>
      </div>`,
    ];
  };
}

export function generateTooltip(
  areasHealthIndicatorData: HealthDataForArea[],
  benchmarkToUse: string,
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
          benchmarkToUse,
          benchmarkComparisonMethod,
          measurementUnit
        )
      );
    },
    useHTML: true,
  };
}
