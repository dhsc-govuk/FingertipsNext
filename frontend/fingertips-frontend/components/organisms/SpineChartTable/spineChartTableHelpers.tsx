import {
  HealthDataForArea,
  IndicatorWithHealthDataForArea,
  QuartileData,
} from '@/generated-sources/ft-api-client';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { IndicatorDocument } from '@/lib/search/searchTypes';

export const spineChartImproperUsageError = 'Improper usage: Spine chart should only be shown when 1-2 areas are selected';
export const spineChartIndicatorTitleColumnMinWidth = 240;

type ExtractedHealthData = {
  orderedHealthDataAreaOne: HealthDataForArea[];
  orderedHealthDataAreaTwo?: HealthDataForArea[];
  orderedGroupData: HealthDataForArea[];
  orderedEnglandData: HealthDataForArea[];
  orderedMetadata: (IndicatorDocument | undefined)[];
  orderedQuartileData: QuartileData[];
};

interface RequestedAreaHealthData {
  areaOneLatestHealthData: HealthDataForArea;
  areaTwoLatestHealthData?: HealthDataForArea;
}

export const extractCombinedHealthData = (
  combinedIndicatorData: IndicatorWithHealthDataForArea[],
  unsortedMetaData: (IndicatorDocument | undefined)[],
  unsortedQuartileData: QuartileData[],
  areasSelected: string[],
  selectedGroupCode?: string
): ExtractedHealthData => {
  const twoAreasDataRequired = areasSelected.length === 2;
  const orderedHealthDataAreaOne: HealthDataForArea[] = new Array(
    combinedIndicatorData.length
  );
  const orderedHealthDataAreaTwo: (HealthDataForArea)[] = new Array(
    combinedIndicatorData.length
  );
  const orderedGroupData: HealthDataForArea[] = new Array(
    combinedIndicatorData.length
  );
  const orderedEnglandData: HealthDataForArea[] = new Array(
    combinedIndicatorData.length
  );
  const orderedMetadata: (IndicatorDocument | undefined)[] = new Array(
    combinedIndicatorData.length
  );
  const orderedQuartileData: QuartileData[] = new Array(
    combinedIndicatorData.length
  );

  combinedIndicatorData.forEach((indicator, index) => {
    if (!indicator.areaHealthData) {
      throw new Error('Missing health data for indicator');
    }

    const {
      areaOneLatestHealthData,
      areaTwoLatestHealthData
    } = extractPerAreaHealthData(indicator, areasSelected);

    orderedHealthDataAreaOne[index] = areaOneLatestHealthData;

    if (twoAreasDataRequired && areaTwoLatestHealthData) {
      orderedHealthDataAreaTwo[index] = areaTwoLatestHealthData;
    }

    const groupData = indicator.areaHealthData.find(
      (areaData) => areaData.areaCode === selectedGroupCode
    );

    if (!groupData) {
      throw new Error('Missing group health data for indicator');
    }
    orderedGroupData[index] = groupData;

    const englandData = indicator.areaHealthData.find(
      (areaData) => areaData.areaCode === areaCodeForEngland
    );

    if (!englandData) {
      throw new Error('Missing England health data for indicator');
    }
    orderedEnglandData[index] = englandData;

    const metadata = unsortedMetaData.find(
      (indicatorMetaData) =>
        Number(indicatorMetaData?.indicatorID) === indicator.indicatorId
    );

    orderedMetadata[index] = metadata;

    const quartileData = unsortedQuartileData.find(
      (data) => data.indicatorId === indicator.indicatorId
    );

    if (!quartileData) {
      throw new Error('Missing quartile data for indicator');
    }
    orderedQuartileData[index] = quartileData;
  });

  return {
    orderedHealthDataAreaOne,
    orderedHealthDataAreaTwo: twoAreasDataRequired ? orderedHealthDataAreaTwo: undefined,
    orderedGroupData,
    orderedEnglandData,
    orderedMetadata,
    orderedQuartileData,
  };
};

/**
 * Retrieves the area health data for each of the areas requested for the spine chart.
 * Up to 2 areas are permitted on the spine chart.
 *
 * @param indicatorWithHealthData - all health data for the requested areas for the given indicator.
 * @param areasSelected - list of area codes requested.
 * @returns per area data for up to 2 areas.
 */
const extractPerAreaHealthData = (
  indicatorWithHealthData: IndicatorWithHealthDataForArea,
  areasSelected: string[],
): RequestedAreaHealthData => {
  if (areasSelected.length < 1 || 2 < areasSelected.length) {
    throw new Error(spineChartImproperUsageError);
  }

  const areaOneLatestHealthData = indicatorWithHealthData.areaHealthData?.find(
    (areaData) => areaData.areaCode === areasSelected[0]
  );

  if (!areaOneLatestHealthData) {
    throw new Error(`Missing area health data for indicator. ID: ${indicatorWithHealthData.indicatorId}, AreaCode: ${areasSelected[0]}`);
  }

  let areaTwoLatestHealthData;

  if (areasSelected.length === 2) {
    areaTwoLatestHealthData = indicatorWithHealthData.areaHealthData?.find(
      (areaData) => areaData.areaCode === areasSelected[1]
    );

    if (!areaTwoLatestHealthData) {
      throw new Error(`Missing area health data for indicator. ID: ${indicatorWithHealthData.indicatorId}, AreaCode: ${areasSelected[1]}`);
    }
  }

  return {
    areaOneLatestHealthData,
    areaTwoLatestHealthData
  }
};
