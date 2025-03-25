import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { GovukColours } from '@/lib/styleHelpers/colours';

export const heatmapIndicatorTitleColumnWidth = '240px';
export const heatmapTitleColumnWidth = '60px';
export const heatmapDataColumnWidth = '60px';

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

interface IndicatorData {
  indicatorId: string;
  indicatorName: string;
  healthDataForAreas: HealthDataForArea[];
  unitLabel: string;
}

interface Row {
  key: string;
  cells: Cell[];
}

interface Cell {
  key: string;
  type: CellType;
  content: string;
  backgroundColour?: string; // not yet implemented
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
}

interface DataPoint {
  value?: number;
  areaCode: string;
  indicatorId: string;
}

export const extractSortedAreasIndicatorsAndDataPoints = (
  indicatorData: IndicatorData[],
  groupAreaCode?: string
): {
  areas: Area[];
  indicators: Indicator[];
  dataPoints: Record<string, Record<string, DataPoint>>;
} => {
  const { areas, indicators, dataPoints } =
    extractAreasIndicatorsAndDataPoints(indicatorData);

  // sort indicators by A-Z
  const { indicatorIds } = orderIndicatorsByName(indicators);

  const precedingAreas = [areaCodeForEngland];
  if (groupAreaCode) {
    precedingAreas.push(groupAreaCode);
  }

  const { areaCodes } = orderAreaByPrecedingThenByName(areas, precedingAreas);

  const sortedAreas: Area[] = areaCodes.map((areaCode) => {
    return areas[areaCode];
  });

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
      cols[areaIndex + leadingCols.length] = {
        key: `col-${indicator.id}-${area.code}`,
        type: CellType.Data,
        content: formatValue(dataPoints[indicator.id][area.code].value), // TODO format numbers
        backgroundColour: generateBackgroundColor(areaIndex, indicatorIndex),
      };
    });
    rows[indicatorIndex] = { key: `row-${indicator.id}`, cells: cols };
  });

  return rows;
};

const formatValue = (value?: number): string => {
  return value !== undefined ? value.toString() : 'X';
};

const generateBackgroundColor = (x: number, y: number): string => {
  return x % 2 == y % 2 ? GovukColours.Yellow : GovukColours.LightGrey;
};

const extractAreasIndicatorsAndDataPoints = (
  indicatorDataForAllAreas: IndicatorData[]
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

      dataPoints[indicatorData.indicatorId][healthData.areaCode] = {
        value:
          healthData.healthData[0].year === latestDataPeriod
            ? healthData.healthData[0].value
            : undefined,
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
