import {
  BenchmarkComparisonMethod,
  HealthDataForArea,
  IndicatorWithHealthDataForArea,
  QuartileData,
} from '@/generated-sources/ft-api-client';
import { IndicatorDocument } from '@/lib/search/searchTypes';

export const spineChartImproperUsageError =
  'Improper usage: Spine chart should only be shown when 1-2 areas are selected';
export const spineChartIndicatorTitleColumnMinWidth = 240;
export const spineChartPeriodColumnMinWidth = 50;
export const paddingSize = 8;

export interface SpineChartIndicatorData {
  indicatorId: string;
  indicatorName: string;
  latestDataPeriod: number;
  benchmarkComparisonMethod?: BenchmarkComparisonMethod;
  valueUnit: string;
  areasHealthData: (HealthDataForArea | null)[];
  groupData: HealthDataForArea | null;
  quartileData: QuartileData;
}

/**
 * Finds the matching area health data based on the requested area code.
 *
 * @param areaHealthData
 * @param areaCode
 * @returns the health data matching the requested area.
 */
export const getHealthDataForArea = (
  areaHealthData: HealthDataForArea[] | undefined,
  areaCode: string
): HealthDataForArea | null => {
  if (!areaHealthData) {
    return null;
  }

  const matchedAreaHealthData = areaHealthData.find(
    (areaHealthDataItem) => areaHealthDataItem.areaCode === areaCode
  );

  if (!matchedAreaHealthData) {
    return null;
  }

  return matchedAreaHealthData;
};

/**
 * Organises all the retrieved data into the desired structure for the spine chart.
 */
export const buildSpineChartIndicatorData = (
  allIndicatorData: IndicatorWithHealthDataForArea[],
  allIndicatorMetadata: IndicatorDocument[],
  quartileData: QuartileData[],
  areasSelected: string[],
  selectedGroupCode: string
): SpineChartIndicatorData[] => {
  return allIndicatorData
    .map((indicatorData) => {
      if (
        indicatorData.indicatorId === undefined ||
        indicatorData.name === null
      ) {
        // the entire row will be missing
        return null;
      }
      const indicatorId = indicatorData.indicatorId.toString();
      const relevantIndicatorMeta = allIndicatorMetadata.find(
        (indicatorMetaData) => {
          return indicatorMetaData.indicatorID === indicatorId;
        }
      );

      const areasHealthData = areasSelected
        .map((areaCode) => {
          return getHealthDataForArea(indicatorData.areaHealthData, areaCode);
        })
        .filter((areaData) => areaData !== null);

      if (
        areasHealthData.length !== areasSelected.length ||
        !areasHealthData[0]
      ) {
        // there was missing data for an area
        return null;
      }

      const matchedQuartileData = quartileData.find(
        (quartileDataItem) =>
          quartileDataItem.indicatorId === indicatorData.indicatorId
      );

      if (!matchedQuartileData) {
        // No quartile data found for the requested indicator ID: ${indicatorData.indicatorId}
        return null;
      }

      const groupData = getHealthDataForArea(
        indicatorData.areaHealthData,
        selectedGroupCode
      );

      return {
        indicatorId,
        indicatorName: indicatorData.name as string,
        valueUnit: relevantIndicatorMeta?.unitLabel ?? '',
        benchmarkComparisonMethod: indicatorData.benchmarkMethod,
        // The latest period for the first area's data (health data is sorted be year ASC)
        latestDataPeriod:
          areasHealthData[0].healthData[
            areasHealthData[0].healthData.length - 1
          ].year,
        areasHealthData,
        groupData,
        quartileData: matchedQuartileData,
      };
    })
    .filter((data) => data !== null);
};
