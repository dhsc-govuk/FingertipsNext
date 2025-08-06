import {
  AreaTypeLabelEnum,
  createTooltipHTML,
  getTooltipContent,
} from '@/lib/chartHelpers/chartHelpers';
import { BenchmarkComparisonMethod } from '@/generated-sources/ft-api-client';
import {
  InequalitiesChartData,
  InequalitiesTypes,
} from '@/components/charts/Inequalities/helpers/inequalitiesHelpers';
import { benchmarkOutcomeForYear } from '@/components/charts/Inequalities/helpers/benchmarkOutcomeForYear';

export const inequalitiesLineChartTooltipForPoint =
  (
    lineChartData: InequalitiesChartData,
    inequalityType: InequalitiesTypes,
    benchmarkComparisonMethod: BenchmarkComparisonMethod,
    unitLabel?: string
  ) =>
  (point: Highcharts.Point, symbol: string) => {
    const period = point.options.name ?? '';
    const { benchmarkLabel, comparisonLabel } = getTooltipContent(
      benchmarkOutcomeForYear(period, point.series.name, lineChartData),
      AreaTypeLabelEnum.Area,
      benchmarkComparisonMethod ?? BenchmarkComparisonMethod.Unknown,
      inequalityType === InequalitiesTypes.Sex
        ? lineChartData.areaName
        : undefined
    );

    const benchmarkComparisonSymbol = `<span style="color: ${point.series.color}; font-weight: bold;">${symbol}</span>`;
    const shouldHideLines = lineChartData.rowData.every(
      (dataPoint) => dataPoint.inequalities[point.series.name]?.isAggregate
    );

    return createTooltipHTML(
      {
        areaName: lineChartData.areaName,
        period,
        fieldName: point.series.name,
        benchmarkComparisonSymbol,
        shouldHideComparison: shouldHideLines,
        benchmarkLabel,
        comparisonLabel,
      },
      point.y,
      unitLabel
    );
  };
