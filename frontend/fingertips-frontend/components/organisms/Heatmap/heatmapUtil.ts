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
import { HeatmapHoverProps } from './heatmapHover';

export const heatmapIndicatorTitleColumnWidth = 240;
export const heatmapDataColumnWidth = 60;

export enum HeaderType {
  IndicatorTitle,
  IndicatorInformation,
  BenchmarkArea,
  GroupArea,
  Area,
}

export enum CellType {
  IndicatorTitle,
  IndicatorInformation,
  Data,
}

export interface HeatmapIndicatorData {
  indicatorId: string;
  indicatorName: string;
  healthDataForAreas: HealthDataForArea[];
  unitLabel: string;
  benchmarkMethod: BenchmarkComparisonMethod;
  polarity: IndicatorPolarity;
}

interface Row {
  key: string;
  cells: Cell[];
}

interface Cell {
  key: string;
  type: CellType;
  content: string;
  backgroundColour?: string;
  hoverProps?: HeatmapHoverProps;
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
  benchmark?: HeatmapBenchmarkProps;
}

export interface HeatmapBenchmarkProps {
  outcome: BenchmarkOutcome;
  benchmarkMethod: BenchmarkComparisonMethod;
  polarity: IndicatorPolarity;
}

export const extractSortedAreasIndicatorsAndDataPoints = (
  indicatorData: HeatmapIndicatorData[],
  groupAreaCode?: string
): {
  areas: Area[];
  indicators: Indicator[];
  dataPoints: Record<string, Record<string, DataPoint>>;
} => {
  const { areas, indicators, dataPoints } =
    extractAreasIndicatorsAndDataPoints(indicatorData);

  const precedingAreas = [areaCodeForEngland];
  if (groupAreaCode) {
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

  return { areas: sortedAreas, indicators: sortedIndicators, dataPoints };
};

export const generateRows = (
  areas: Area[],
  indicators: Indicator[],
  dataPoints: Record<string, Record<string, DataPoint>>
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
        key: `col-${indicator.id}-unitlabel`,
        type: CellType.IndicatorInformation,
        content: indicator.unitLabel,
      },
      {
        key: `col-${indicator.id}-period`,
        type: CellType.IndicatorInformation,
        content: indicator.latestDataPeriod.toString(),
      },
    ];

    const cols = new Array<Cell>(areas.length + leadingCols.length);

    leadingCols.forEach((col, index) => {
      cols[index] = col;
    });

    areas.forEach((area, areaIndex) => {
      const formattedValue = formatNumber(
        dataPoints[indicator.id][area.code]?.value
      );
      cols[areaIndex + leadingCols.length] = {
        key: `cell-${indicator.id}-${area.code}`,
        type: CellType.Data,
        content: formattedValue,
        backgroundColour:
          area.code === areaCodeForEngland
            ? GovukColours.MidGrey
            : generateDataBackgroundColour(dataPoints[indicator.id][area.code]),
        hoverProps: {
          areaName: getHoverAreaName(area),
          period: indicator.latestDataPeriod.toString(),
          indicatorName: indicator.name,
          value: formattedValue,
          unitLabel: indicator.unitLabel,
          benchmark: {
            outcome: BenchmarkOutcome.NotCompared,
            benchmarkMethod: BenchmarkComparisonMethod.Unknown,
            polarity: IndicatorPolarity.Unknown,
          },
        },
      };
    });
    rows[indicatorIndex] = { key: `row-${indicator.id}`, cells: cols };
  });

  return rows;
};

const generateDataBackgroundColour = (dataPoint?: DataPoint): string => {
  if (
    !dataPoint?.value ||
    !dataPoint.benchmark?.benchmarkMethod ||
    !dataPoint.benchmark?.polarity
  ) {
    return GovukColours.White;
  }

  const colour = getBenchmarkColour(
    dataPoint.benchmark.benchmarkMethod,
    dataPoint.benchmark.outcome,
    dataPoint.benchmark.polarity
  );

  return colour ?? GovukColours.White;
};

const getHoverAreaName = (area: Area, groupAreaCode?: string): string => {
  if (area.code === areaCodeForEngland) {
    return `Benchmark: ${area.name}`;
  }

  if (groupAreaCode && area.code === groupAreaCode) {
    return `Group: ${area.name}`;
  }

  return area.name;
};

const extractAreasIndicatorsAndDataPoints = (
  indicatorDataForAllAreas: HeatmapIndicatorData[]
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
        benchmarkMethod: indicatorData.benchmarkMethod,
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
      if (healthData.healthData[0].year > latestDataPeriod) {
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

      const healthDataForYear =
        healthData.healthData[0].year === latestDataPeriod
          ? healthData.healthData[0]
          : undefined;

      const benchmark: HeatmapBenchmarkProps = {
        outcome:
          healthDataForYear?.benchmarkComparison?.outcome ??
          BenchmarkOutcome.NotCompared,
        benchmarkMethod: indicatorData.benchmarkMethod,
        polarity: indicatorData.polarity,
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

  return { areas: areas, indicators: indicators, dataPoints: dataPoints };
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
  groupAreaCode?: string
): Header[] => {
  const getHeaderType = (pos: number, areaCode?: string): HeaderType => {
    if (pos === 0) {
      return HeaderType.IndicatorTitle;
    }

    if (pos === 1 || pos === 2) {
      return HeaderType.IndicatorInformation;
    }

    if (areaCode === areaCodeForEngland) {
      return HeaderType.BenchmarkArea;
    }

    if (groupAreaCode && areaCode === groupAreaCode) {
      return HeaderType.GroupArea;
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
        return `${prefix}-unitlabel`;
      }
      case 2: {
        return `${prefix}-period`;
      }
      default: {
        return `${prefix}-${areaCode}`;
      }
    }
  };

  const constantHeaderTitles = ['Indicators', 'Value unit', 'Period'];
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
          content: area.name,
          type: getHeaderType(index + constantHeaderTitles.length, area.code),
        };
      })
    );
};
