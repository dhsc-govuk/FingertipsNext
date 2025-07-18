import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import { getBenchmarkColour } from '@/lib/chartHelpers/chartHelpers';
import { GovukColours } from '@/lib/styleHelpers/colours';
import { formatNumber } from '@/lib/numberFormatter';
import {
  Area,
  CellType,
  DataPoint,
  Cell,
  Row,
  Indicator,
} from '../heatmap.types';

export const DEFAULT_BACKGROUND_COLOUR = GovukColours.White;

export const generateRows = (
  areas: Area[],
  indicators: Indicator[],
  dataPoints: Record<string, Record<string, DataPoint>>,
  groupAreaCode: string,
  benchmarkAreaCode: string
): Row[] => {
  const rows = new Array<Row>(indicators.length);
  indicators.forEach((indicator, indicatorIndex) => {
    const leadingCols: Cell[] = [
      {
        key: `col-${indicator.id}-title`,
        type: CellType.IndicatorTitle,
        content: indicator.name,
      },
      {
        key: `col-${indicator.id}-period`,
        type: CellType.IndicatorPeriod,
        content: indicator.latestDataPeriod
          ? indicator.latestDataPeriod.toString()
          : '',
      },
      {
        key: `col-${indicator.id}-unitlabel`,
        type: CellType.IndicatorValueUnit,
        content: indicator.unitLabel,
      },
    ];

    const cols = new Array<Cell>(areas.length + leadingCols.length);

    leadingCols.forEach((col, index) => {
      cols[index] = col;
    });

    areas.forEach((area, areaIndex) => {
      cols[areaIndex + leadingCols.length] = {
        key: `cell-${indicator.id}-${area.code}`,
        type: CellType.Data,
        content: formatNumber(dataPoints[indicator.id][area.code]?.value),
        backgroundColour: generateDataBackgroundColour(
          dataPoints[indicator.id][area.code],
          benchmarkAreaCode
        ),
        hoverProps: {
          areaName: getHoverAreaName(area, groupAreaCode, benchmarkAreaCode),
          period: indicator.latestDataPeriod,
          indicatorName: indicator.name,
          value: dataPoints[indicator.id][area.code]?.value,
          unitLabel: indicator.unitLabel,
          benchmark: {
            outcome:
              dataPoints[indicator.id][area.code]?.benchmark?.outcome ??
              BenchmarkOutcome.NotCompared,
            benchmarkMethod:
              dataPoints[indicator.id][area.code]?.benchmark?.benchmarkMethod ??
              BenchmarkComparisonMethod.Unknown,
            polarity:
              dataPoints[indicator.id][area.code]?.benchmark?.polarity ??
              IndicatorPolarity.Unknown,
            benchmarkAreaCode:
              dataPoints[indicator.id][area.code]?.benchmark
                ?.benchmarkAreaCode ?? '',
          },
        },
      };
    });
    rows[indicatorIndex] = { key: `row-${indicator.id}`, cells: cols };
  });

  return rows;
};

export const generateDataBackgroundColour = (
  dataPoint: DataPoint,
  benchmarkAreaCode: string
): string => {
  if (
    !dataPoint?.value ||
    !dataPoint.benchmark?.benchmarkMethod ||
    !dataPoint.benchmark?.polarity
  ) {
    return DEFAULT_BACKGROUND_COLOUR;
  }

  if (dataPoint.benchmark.outcome === 'Baseline') {
    return dataPoint.areaCode === benchmarkAreaCode
      ? GovukColours.MidGrey
      : GovukColours.LightGrey;
  }

  const colour = getBenchmarkColour(
    dataPoint.benchmark.benchmarkMethod,
    dataPoint.benchmark.outcome,
    dataPoint.benchmark.polarity
  );

  return colour ?? DEFAULT_BACKGROUND_COLOUR;
};

export const getHoverAreaName = (
  area: Area,
  groupAreaCode: string,
  benchmarkAreaCode: string
): string => {
  if (area.code === benchmarkAreaCode) {
    return `Benchmark: ${area.name}`;
  }

  if (groupAreaCode && area.code === groupAreaCode) {
    return `Group: ${area.name}`;
  }

  return area.name;
};
