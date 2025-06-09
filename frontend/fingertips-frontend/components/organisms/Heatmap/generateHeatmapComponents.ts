import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import { getBenchmarkColour } from '@/lib/chartHelpers/chartHelpers';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { GovukColours } from '@/lib/styleHelpers/colours';
import { formatNumber } from '@/lib/numberFormatter';
import {
  Area,
  CellType,
  DataPoint,
  HeaderType,
  Cell,
  Row,
  Indicator,
  Header,
} from './heatmapTypes';

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

const generateDataBackgroundColour = (
  dataPoint: DataPoint,
  benchmarkAreaCode: string
): string => {
  if (
    !dataPoint?.value ||
    !dataPoint.benchmark?.benchmarkMethod ||
    !dataPoint.benchmark?.polarity
  ) {
    return GovukColours.White;
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

  return colour ?? GovukColours.White;
};

const getHoverAreaName = (
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

export const generateHeaders = (
  areas: Area[],
  groupAreaCode: string,
  benchmarkAreaCode: string
): Header[] => {
  const getHeaderType = (pos: number, areaCode?: string): HeaderType => {
    if (pos === 0) {
      return HeaderType.IndicatorTitle;
    }

    if (pos === 1) {
      return HeaderType.Period;
    }

    if (pos === 2) {
      return HeaderType.ValueUnit;
    }

    if (areaCode === areaCodeForEngland) {
      return benchmarkAreaCode === areaCodeForEngland
        ? HeaderType.BenchmarkGroupArea
        : HeaderType.NonBenchmarkGroupArea;
    }

    if (groupAreaCode && areaCode === groupAreaCode) {
      return benchmarkAreaCode === areaCodeForEngland
        ? HeaderType.NonBenchmarkGroupArea
        : HeaderType.BenchmarkGroupArea;
    }

    return HeaderType.Area;
  };

  const generateHeaderKey = (pos: number, areaCode?: string) => {
    const prefix = 'header';
    switch (pos) {
      case 0: {
        return `${prefix}-indicator`;
      }
      case 1: {
        return `${prefix}-period`;
      }
      case 2: {
        return `${prefix}-unitlabel`;
      }
      default: {
        return `${prefix}-${areaCode}`;
      }
    }
  };

  const generateHeaderTitle = (
    areaCode: string,
    areaName: string,
    groupAreaCode: string,
    benchmarkAreaCode: string
  ) => {
    if (areaCode !== areaCodeForEngland && areaCode !== groupAreaCode) {
      return areaName;
    }

    if (areaCode === areaCodeForEngland) {
      return benchmarkAreaCode === areaCodeForEngland
        ? `Benchmark: ${areaName}`
        : areaName;
    }

    return benchmarkAreaCode === groupAreaCode
      ? `Benchmark: ${areaName}`
      : `Group: ${areaName}`;
  };

  const constantHeaderTitles = ['Indicators', 'Period', 'Value unit'];
  return constantHeaderTitles
    .map((title, index) => {
      return {
        key: generateHeaderKey(index),
        type: getHeaderType(index),
        content: title,
      };
    })
    .concat(
      areas.map((area, index) => {
        return {
          key: generateHeaderKey(
            index + constantHeaderTitles.length,
            area.code
          ),
          content: generateHeaderTitle(
            area.code,
            area.name,
            groupAreaCode,
            benchmarkAreaCode
          ),
          type: getHeaderType(index + constantHeaderTitles.length, area.code),
        };
      })
    );
};
