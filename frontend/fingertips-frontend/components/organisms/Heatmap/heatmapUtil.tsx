import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { GovukColours } from '@/lib/styleHelpers/colours';

// TODO - export less

export interface IndicatorData {
  indicatorId: string;
  indicatorName: string;
  healthDataForAreas: HealthDataForArea[];
  unitLabel: string;
}

type row = {
  key: string;
  cells: cell[];
};

type cell = {
  key: string;
  content: string;
  backgroundColour?: string; // not yet implemented
};

export type area = {
  code: string;
  position?: number;
  name: string;
};

export type indicator = {
  id: string;
  position?: number;
  name: string;
  unitLabel: string;
  latestDataPeriod: number;
};

export interface DataPoint {
  value?: number;
  areaCode: string;
  indicatorId: string;
}

export const generateHeadersAndRows = (
  indicatorDataForAllAreas: IndicatorData[],
  groupAreaCode?: string
): { headers: cell[]; rows: row[] } => {
  const { areas, indicators, dataPoints } = extractAreasIndicatorsAndDataPoints(
    indicatorDataForAllAreas
  );

  // sort indicators by A-Z
  const { indicatorIds, indicators: indicatorsWithPosition } =
    orderIndicatorsByName(indicators);

  const precedingAreas = [areaCodeForEngland];
  if (groupAreaCode) {
    precedingAreas.push(groupAreaCode);
  }

  const { areaCodes, areas: areasWithPosition } =
    orderAreaByNameWithSomeCodesInFront(areas, precedingAreas);

  const sortedAreas: area[] = areaCodes.map((areaCode) => {
    return areas[areaCode];
  });

  const sortedIndicators: indicator[] = indicatorIds.map((indicatorId) => {
    return indicators[indicatorId];
  });

  const tableRows = new Array<row>(sortedIndicators.length);
  sortedIndicators.map((indicator, indicatorIndex) => {
    const leadingCols: cell[] = [
      {
        key: 'col-' + indicator.id + 'name',
        content: indicator.name,
      },
      {
        key: 'col-' + indicator.id + 'unitLabel',
        content: indicator.unitLabel,
      },
      {
        key: 'col-' + indicator.id + 'period',
        content: indicator.latestDataPeriod.toString(),
      },
    ];

    const cols = new Array<cell>(sortedAreas.length + leadingCols.length);

    leadingCols.map((col, index) => {
      cols[index] = col;
    });

    sortedAreas.map((area, areaIndex) => {
      cols[areaIndex + leadingCols.length] = {
        key: 'col-' + indicator.id + '-' + area.code,
        content: formatValue(dataPoints[indicator.id][area.code].value),
        backgroundColour: generateBackgroundColor(areaIndex, indicatorIndex),
      };
    });
    tableRows[indicatorIndex] = { key: 'row-' + indicator.id, cells: cols };
  });

  return {
    headers: generateHeaders(sortedAreas),
    rows: tableRows,
  };
};

const formatValue = (value?: number): string => {
  return value ? value.toString() : 'X';
};

const generateBackgroundColor = (x: number, y: number): string => {
  return x % 2 == y % 2 ? GovukColours.Yellow : GovukColours.LightGrey;
};

// This has been very difficult to split up
export const extractAreasIndicatorsAndDataPoints = (
  indicatorDataForAllAreas: IndicatorData[]
): {
  areas: Record<string, area>;
  indicators: Record<string, indicator>;
  dataPoints: Record<string, Record<string, DataPoint>>;
} => {
  const areas: Record<string, area> = {};
  const indicators: Record<string, indicator> = {};
  const dataPoints: Record<string, Record<string, DataPoint>> = {};

  indicatorDataForAllAreas.map((indicatorData) => {
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

    indicatorData.healthDataForAreas.map((healthData) => {
      healthData.healthData.sort((a, b) => {
        return b.year - a.year;
      });
      if (healthData.healthData[0].year > latestDataPeriod) {
        latestDataPeriod = healthData.healthData[0].year;
      }
    });

    indicatorData.healthDataForAreas.map((healthData) => {
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

export const orderIndicatorsByName = (
  indicators: Record<string, indicator>
): { indicatorIds: string[]; indicators: Record<string, indicator> } => {
  const indicatorIds: string[] = [];
  for (let indicatorId in indicators) {
    indicatorIds.push(indicatorId);
  }

  indicatorIds.sort((a, b) =>
    indicators[a].name.localeCompare(indicators[b].name)
  );

  indicatorIds.map((indicatorId, index) => {
    indicators[indicatorId] = {
      ...indicators[indicatorId],
      position: index,
    };
  });

  return { indicatorIds, indicators };
};

// TODO - give this a better name
export const orderAreaByNameWithSomeCodesInFront = (
  areas: Record<string, area>,
  precedingCodes: string[]
): { areaCodes: string[]; areas: Record<string, area> } => {
  const areaCodes: string[] = [];
  for (let areaCode in areas) {
    if (
      !precedingCodes.find((precedingCode) => {
        return precedingCode === areaCode;
      })
    )
      areaCodes.push(areaCode);
  }

  areaCodes.sort((a, b) => areas[a].name.localeCompare(areas[b].name));

  precedingCodes.reverse().map((precedingCode) => {
    areaCodes.unshift(precedingCode);
  });

  areaCodes.map((areaCode, index) => {
    areas[areaCode] = {
      ...areas[areaCode],
      position: index,
    };
  });

  return { areaCodes, areas };
};

const generateHeaders = (areas: area[]): cell[] => {
  const generateHeaderKey = (pos: number, areaCode?: string) => {
    const prefix = 'header-';
    switch (pos) {
      case 0: {
        return prefix + 'indicator';
      }
      case 1: {
        return prefix + 'value-type';
      }
      case 2: {
        return prefix + 'period';
      }
      default: {
        return prefix + areaCode;
      }
    }
  };

  const constantHeaderTitles = ['Indicators', 'Value unit', 'Period'];
  return constantHeaderTitles
    .map((title, index) => {
      return { content: title, key: generateHeaderKey(index) };
    })
    .concat(
      areas.map((area, index) => {
        return {
          content: area.name,
          key: generateHeaderKey(
            index + constantHeaderTitles.length,
            area.code
          ),
        };
      })
    );
};
