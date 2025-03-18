import {
  HealthDataForArea,
  HealthDataPoint,
} from '@/generated-sources/ft-api-client';
import {
  sortHealthDataByYearDescending,
  sortHealthDataForAreaByDate,
} from '@/lib/chartHelpers/chartHelpers';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';

// TODO - export less

export interface IndicatorData {
  indicatorId: string;
  indicatorName: string;
  healthDataForAreas: HealthDataForArea[];
  unitLabel: string;
}

type chartItem = {
  x: number;
  y: number;

  dataPoint?: DataPoint;
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
};

export interface DataPoint {
  value?: number;
  areaCode: string;
  indicatorId: string;
}

export const generateChartItems = (
  indicatorDataForAllAreas: IndicatorData[],
  groupAreaCode?: string
) => {
  const { areas, indicators, dataPoints } = extractAreasIndicatorsAndDataPoints(
    indicatorDataForAllAreas
  );

  // sort indicators by A-Z
  const indicatorsWithPosition = orderIndicatorsByName(indicators);

  const precedingAreas = [areaCodeForEngland];
  if (groupAreaCode) {
    precedingAreas.push(groupAreaCode);
  }
  const areasWithPosition = orderAreaByNameWithSomeCodesInFront(
    areas,
    precedingAreas
  );

  const chartItems: chartItem[] = [];
  dataPoints.map((dataPoint) => {
    chartItems.push({
      x: areasWithPosition[dataPoint.areaCode].position!,
      y: indicatorsWithPosition[dataPoint.indicatorId].position!,
      dataPoint: dataPoint,
    });
  });

  return chartItems;
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
  });

  return { areas: areas, indicators: indicators, dataPoints: dataPoints };
};

export const orderIndicatorsByName = (
  indicators: Record<string, indicator>
): Record<string, indicator> => {
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

  return indicators;
};

// TODO - give this a better name
export const orderAreaByNameWithSomeCodesInFront = (
  areas: Record<string, area>,
  precedingCodes: string[]
): Record<string, area> => {
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

  return areas;
};
