import {
  HealthDataForArea,
  HealthDataPoint,
} from '@/generated-sources/ft-api-client';
import {
  sortHealthDataByYearDescending,
  sortHealthDataForAreaByDate,
} from '@/lib/chartHelpers/chartHelpers';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { GovukColours } from '@/lib/styleHelpers/colours';

// TODO - export less

export interface IndicatorData {
  indicatorId: string;
  indicatorName: string;
  healthDataForAreas: HealthDataForArea[];
  unitLabel: string;
}

type tableRow = {
  key: string;
  cols: tableCol[];
};

type tableCol = {
  key: string;
  content: string;
  backgroundColour?: string; // not yet implemented
};

type chartLabelItem = {
  x: number;
  y: number;
  value?: undefined;
  name: string | undefined;
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

export const generateAreasIndicatorsAndTableRows = (
  indicatorDataForAllAreas: IndicatorData[],
  groupAreaCode?: string
): { areas: area[]; indicators: indicator[]; tableRows: tableRow[] } => {
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

  const tableRows = new Array<tableRow>(sortedIndicators.length);
  sortedIndicators.map((indicator, indicatorIndex) => {
    const leadingCols: tableCol[] = [
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

    const cols = new Array<tableCol>(sortedAreas.length + leadingCols.length);

    leadingCols.map((col, index) => {
      cols[index] = col;
    });

    sortedAreas.map((area, areaIndex) => {
      cols[areaIndex + leadingCols.length] = {
        key: 'col-' + indicator.id + '-' + area.code,
        content: 'TODO',
      };
    });
    tableRows[indicatorIndex] = { key: 'row-' + indicator.id, cols: cols };
  });

  // TODO DELETEME
  console.log(tableRows);

  return {
    areas: sortedAreas,
    indicators: sortedIndicators,
    tableRows: tableRows,
  };
};

export const extractAreasIndicatorsAndDataPoints = (
  indicatorDataForAllAreas: IndicatorData[]
): {
  areas: Record<string, area>;
  indicators: Record<string, indicator>;
  dataPoints: DataPoint[];
} => {
  const areas: Record<string, area> = {};
  const indicators: Record<string, indicator> = {};
  const dataPoints: DataPoint[] = [];

  indicatorDataForAllAreas.map((indicatorData) => {
    if (!indicators[indicatorData.indicatorId]) {
      indicators[indicatorData.indicatorId] = {
        id: indicatorData.indicatorId,
        name: indicatorData.indicatorName,
        unitLabel: indicatorData.unitLabel,
        latestDataPeriod: 0,
      };
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

      dataPoints.push({
        value:
          healthData.healthData[0].year === latestDataPeriod
            ? healthData.healthData[0].value
            : undefined,
        areaCode: healthData.areaCode,
        indicatorId: indicatorData.indicatorId,
      });
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
