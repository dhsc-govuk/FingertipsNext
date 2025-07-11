import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
  HealthDataForArea,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import { getBenchmarkColour } from '@/lib/chartHelpers/chartHelpers';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { GovukColours } from '@/lib/styleHelpers/colours';
import { formatNumber } from '@/lib/numberFormatter';

export const heatmapIndicatorTitleColumnWidth = 240;
export const heatmapDataColumnWidth = 60;

export enum HeaderType {
  IndicatorTitle,
  Period,
  ValueUnit,
  BenchmarkGroupArea,
  NonBenchmarkGroupArea,
  Area,
}

export enum CellType {
  IndicatorTitle,
  IndicatorPeriod,
  IndicatorValueUnit,
  Data,
}

export interface HeatmapIndicatorData {
  indicatorId: string;
  indicatorName: string;
  healthDataForAreas: HealthDataForArea[];
  unitLabel: string;
  benchmarkComparisonMethod: BenchmarkComparisonMethod;
  polarity: IndicatorPolarity;
}

export interface HeatmapDataRow {
  key: string;
  cells: HeatmapDataCell[];
}

export interface DataCellHoverProps {
  areaName: string;
  period: number;
  indicatorName: string;
  value?: number;
  unitLabel: string;
  benchmark: DataPointBenchmark;
}

export interface HeatmapDataCell {
  key: string;
  type: CellType;
  content: string;
  backgroundColour?: string;
  hoverProps?: DataCellHoverProps;
}

interface Header {
  key: string;
  type: HeaderType;
  content: string;
}

interface Area {
  code: string;
  position?: number;
  name: string;
}

interface Indicator {
  id: string;
  position?: number;
  name: string;
  unitLabel: string;
  latestDataPeriod: number;
  benchmarkMethod?: BenchmarkComparisonMethod;
  polarity?: IndicatorPolarity;
}

interface DataPoint {
  value?: number;
  areaCode: string;
  indicatorId: string;
  benchmark?: DataPointBenchmark;
}

export interface DataPointBenchmark {
  outcome: HeatmapBenchmarkOutcome;
  benchmarkMethod: BenchmarkComparisonMethod;
  polarity: IndicatorPolarity;
  benchmarkAreaCode?: string;
}

export type HeatmapBenchmarkOutcome = BenchmarkOutcome | 'Baseline';

export const extractSortedAreasIndicatorsAndDataPoints = (
  indicatorData: HeatmapIndicatorData[],
  groupAreaCode: string,
  benchmarkAreaCode: string
): {
  areas: Area[];
  indicators: Indicator[];
  dataPoints: Record<string, Record<string, DataPoint>>;
} => {
  const { areas, indicators, dataPoints } = extractAreasIndicatorsAndDataPoints(
    indicatorData,
    benchmarkAreaCode
  );

  const precedingAreas = [areaCodeForEngland];

  if (groupAreaCode !== areaCodeForEngland) {
    precedingAreas.push(groupAreaCode);
  }

  const { areaCodes } = orderAreaByPrecedingThenByName(areas, precedingAreas);
  const sortedAreas: Area[] = areaCodes.map((areaCode) => {
    return areas[areaCode];
  });

  const { indicatorIds } = orderIndicatorsByName(indicators);
  const sortedIndicators: Indicator[] = indicatorIds.map((indicatorId) => {
    return indicators[indicatorId];
  });

  return {
    areas: sortedAreas,
    indicators: sortedIndicators,
    dataPoints: dataPoints,
  };
};

export const generateRows = (
  areas: Area[],
  indicators: Indicator[],
  dataPoints: Record<string, Record<string, DataPoint>>,
  groupAreaCode: string,
  benchmarkAreaCode: string
): HeatmapDataRow[] => {
  const rows = new Array<HeatmapDataRow>(indicators.length);
  indicators.forEach((indicator, indicatorIndex) => {
    const leadingCols: HeatmapDataCell[] = [
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

    const cols = new Array<HeatmapDataCell>(areas.length + leadingCols.length);

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

const extractAreasIndicatorsAndDataPoints = (
  indicatorDataForAllAreas: HeatmapIndicatorData[],
  benchmarkAreaCode: string
): {
  areas: Record<string, Area>;
  indicators: Record<string, Indicator>;
  dataPoints: Record<string, Record<string, DataPoint>>;
} => {
  const areas: Record<string, Area> = {};
  const indicators: Record<string, Indicator> = {};
  const dataPoints: Record<string, Record<string, DataPoint>> = {};

  indicatorDataForAllAreas.forEach((indicatorData) => {
    if (!indicators[indicatorData.indicatorId]) {
      indicators[indicatorData.indicatorId] = {
        id: indicatorData.indicatorId,
        name: indicatorData.indicatorName,
        unitLabel: indicatorData.unitLabel,
        latestDataPeriod: 0,
        benchmarkMethod: indicatorData.benchmarkComparisonMethod,
        polarity: indicatorData.polarity,
      };

      dataPoints[indicatorData.indicatorId] = {};
    }

    if (
      indicatorData.healthDataForAreas.length < 1 ||
      indicatorData.healthDataForAreas[0].healthData.length < 1
    ) {
      return;
    }

    let latestDataPeriod =
      indicatorData.healthDataForAreas[0].healthData[0].year;

    indicatorData.healthDataForAreas.forEach((healthData) => {
      healthData.healthData.sort((a, b) => {
        return b.year - a.year;
      });
      if (
        healthData.areaCode !== areaCodeForEngland &&
        healthData.healthData.length > 0 &&
        healthData.healthData[0].year > latestDataPeriod
      ) {
        latestDataPeriod = healthData.healthData[0].year;
      }
    });

    indicatorData.healthDataForAreas.forEach((healthData) => {
      if (!areas[healthData.areaCode]) {
        areas[healthData.areaCode] = {
          code: healthData.areaCode,
          name: healthData.areaName,
        };
      }

      const healthDataForYear = healthData.healthData.find((dataPoint) => {
        return dataPoint.year === latestDataPeriod;
      });

      const getBenchmarkOutcome = (
        outcome?: BenchmarkOutcome
      ): HeatmapBenchmarkOutcome => {
        if (
          healthData.areaCode === benchmarkAreaCode ||
          healthData.areaCode === areaCodeForEngland
        ) {
          return 'Baseline';
        }

        return outcome ?? BenchmarkOutcome.NotCompared;
      };

      const benchmark: DataPointBenchmark = {
        outcome: getBenchmarkOutcome(
          healthDataForYear?.benchmarkComparison?.outcome
        ),
        benchmarkMethod: indicatorData.benchmarkComparisonMethod,
        polarity: indicatorData.polarity,
        benchmarkAreaCode: benchmarkAreaCode,
      };

      dataPoints[indicatorData.indicatorId][healthData.areaCode] = {
        value: healthDataForYear?.value,
        benchmark: benchmark,
        areaCode: healthData.areaCode,
        indicatorId: indicatorData.indicatorId,
      };
    });

    indicators[indicatorData.indicatorId].latestDataPeriod = latestDataPeriod;
  });

  return {
    areas: areas,
    indicators: indicators,
    dataPoints: dataPoints,
  };
};

const orderIndicatorsByName = (
  indicators: Record<string, Indicator>
): { indicatorIds: string[] } => {
  const indicatorIds: string[] = [];
  for (const indicatorId in indicators) {
    indicatorIds.push(indicatorId);
  }

  indicatorIds.sort((a, b) =>
    indicators[a].name.localeCompare(indicators[b].name)
  );

  return { indicatorIds };
};

const orderAreaByPrecedingThenByName = (
  areas: Record<string, Area>,
  precedingCodes: string[]
): { areaCodes: string[] } => {
  const areaCodes: string[] = [];
  for (const areaCode in areas) {
    if (
      !precedingCodes.find((precedingCode) => {
        return precedingCode === areaCode;
      })
    )
      areaCodes.push(areaCode);
  }

  areaCodes.sort((a, b) => areas[a].name.localeCompare(areas[b].name));

  return { areaCodes: precedingCodes.concat(areaCodes) };
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
