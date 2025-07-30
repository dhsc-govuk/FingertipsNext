import {
  BenchmarkOutcome,
  HealthDataForArea,
} from '@/generated-sources/ft-api-client';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import {
  HeatmapIndicatorData,
  HeatmapBenchmarkOutcome,
  Benchmark,
  Area,
  Indicator,
  DataPoint,
} from '../heatmap.types';
import { filterDefined } from '@/lib/chartHelpers/filterDefined';
import {
  convertDateToNumber,
  formatDatePointLabel,
} from '@/lib/timePeriodHelpers/getTimePeriodLabels';
import { getLatestPeriod } from '@/lib/chartHelpers/chartHelpers';

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
  const sortedAreas: Area[] = areaCodes
    .map((areaCode) => areas[areaCode])
    .filter(filterDefined);

  return {
    areas: sortedAreas,
    indicators: Object.values(indicators),
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

  const indicatorEnglandData: Record<string, HealthDataForArea> =
    indicatorDataForAllAreas.reduce(
      (acc, indicatorDataForArea) => {
        const englandHealthData = indicatorDataForArea.healthDataForAreas.find(
          (healthData) => healthData.areaCode === areaCodeForEngland
        );
        if (englandHealthData) {
          acc[indicatorDataForArea.indicatorId] = englandHealthData;
        }
        return acc;
      },
      {} as Record<string, HealthDataForArea>
    );

  indicatorDataForAllAreas.forEach((indicatorData) => {
    const latestDataPeriodNumber = getLatestPeriod(
      indicatorEnglandData[indicatorData.indicatorId].healthData
    );
    const latestHealthDataPoint = indicatorEnglandData[
      indicatorData.indicatorId
    ].healthData.find(
      (point) =>
        convertDateToNumber(point.datePeriod?.to) === latestDataPeriodNumber
    );
    const latestDataPeriod = latestHealthDataPoint?.datePeriod;

    // console.log(`indicatorData ${JSON.stringify(indicatorData, null, 2)}`)

    if (!indicators[indicatorData.rowId]) {
      indicators[indicatorData.rowId] = {
        id: indicatorData.rowId,
        name: indicatorData.indicatorName,
        unitLabel: indicatorData.unitLabel,
        latestDataPeriod: formatDatePointLabel(
          latestDataPeriod,
          indicatorData.frequency,
          indicatorData.isSmallestReportingPeriod
        ),
        benchmarkMethod: indicatorData.benchmarkComparisonMethod,
        polarity: indicatorData.polarity,
      };

      dataPoints[indicatorData.rowId] = {};
    }

    if (
      indicatorData.healthDataForAreas.length < 1 ||
      indicatorData.healthDataForAreas[0].healthData.length < 1
    ) {
      return;
    }

    indicatorData.healthDataForAreas.forEach((healthData) => {
      if (!areas[healthData.areaCode]) {
        areas[healthData.areaCode] = {
          code: healthData.areaCode,
          name: healthData.areaName,
        };
      }

      const healthDataForPeriod = healthData.healthData.find((dataPoint) => {
        return (
          convertDateToNumber(dataPoint.datePeriod?.to) ===
          convertDateToNumber(latestDataPeriod?.to)
        );
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
          healthDataForPeriod?.benchmarkComparison?.outcome
        ),
        benchmarkMethod: indicatorData.benchmarkComparisonMethod,
        polarity: indicatorData.polarity,
        benchmarkAreaCode: benchmarkAreaCode,
      };

      dataPoints[indicatorData.rowId][healthData.areaCode] = {
        value: healthDataForPeriod?.value,
        benchmark: benchmark,
        areaCode: healthData.areaCode,
        indicatorId: indicatorData.rowId,
      };
    });
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
