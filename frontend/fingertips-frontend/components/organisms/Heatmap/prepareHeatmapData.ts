import { BenchmarkOutcome } from '@/generated-sources/ft-api-client';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import {
  HeatmapIndicatorData,
  HeatmapBenchmarkOutcome,
  Benchmark,
  Area,
  Indicator,
  DataPoint,
} from './heatmapTypes';

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

interface UnsortedHeatmapData {
  areas: Record<string, Area>;
  indicators: Record<string, Indicator>;
  dataPoints: Record<string, Record<string, DataPoint>>;
}

export const extractAreasIndicatorsAndDataPoints = (
  indicatorDataForAllAreas: HeatmapIndicatorData[],
  benchmarkAreaCode: string
): UnsortedHeatmapData => {
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

      const benchmark: Benchmark = {
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
