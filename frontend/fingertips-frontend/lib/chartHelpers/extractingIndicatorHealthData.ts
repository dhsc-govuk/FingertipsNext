import {
  HealthDataForArea,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { IndicatorDocument } from '@/lib/search/searchTypes';

type ExtractedIndicatorHealthData = {
  orderedEnglandData: HealthDataForArea[];
  orderedMetadata: (IndicatorDocument | undefined)[];
};

export const extractingIndicatorHealthData = (
  combinedIndicatorData: IndicatorWithHealthDataForArea[],
  unsortedMetaData: (IndicatorDocument | undefined)[]
): ExtractedIndicatorHealthData => {
  const orderedEnglandData: HealthDataForArea[] = new Array(
    combinedIndicatorData.length
  );

  const orderedMetadata: (IndicatorDocument | undefined)[] = new Array(
    combinedIndicatorData.length
  );

  combinedIndicatorData.forEach((indicator, index) => {
    if (!indicator.areaHealthData) {
      throw new Error('Missing health data for indicator');
    }

    const englandData = indicator.areaHealthData.find(
      (areaData) => areaData.areaCode === areaCodeForEngland
    );

    if (!englandData) {
      return [];
    }
    orderedEnglandData[index] = englandData;

    orderedMetadata[index] = unsortedMetaData?.find(
      (indicatorMetaData) =>
        Number(indicatorMetaData?.indicatorID) === indicator.indicatorId
    );
  });

  console.log(orderedEnglandData);
  console.log(orderedMetadata);

  return {
    orderedEnglandData,
    orderedMetadata,
  };
};
