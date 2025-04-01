import { SpineChartProps } from '@/components/organisms/SpineChart';
import {
  HealthDataForArea,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { IndicatorDocument } from '@/lib/search/searchTypes';

type ExtractedHealthData = {
  orderedHealthData: HealthDataForArea[];
  orderedGroupData: HealthDataForArea[];
  orderedEnglandData: HealthDataForArea[];
  orderedMetadata: (IndicatorDocument | undefined)[];
  orderedBenchmarkStatistics: SpineChartProps[];
};

export const extractAndSortHealthData = (
  combinedIndicatorData: IndicatorWithHealthDataForArea[],
  unsortedMetaData: (IndicatorDocument | undefined)[],
  areasSelected: string[],
  selectedGroupCode?: string
): ExtractedHealthData => {
  const orderedHealthData: HealthDataForArea[] = new Array(
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
  const orderedBenchmarkStatistics: SpineChartProps[] = []

  combinedIndicatorData.forEach((indicator, index) => {
    if (!indicator.areaHealthData) {
      throw new Error('Missing health data for indicator');
    }

    const healthData = indicator.areaHealthData.find(
      (areaData) => areaData.areaCode === areasSelected[0]
    );

    if (!healthData) {
      throw new Error('Missing area health data for indicator');
    }
    orderedHealthData[index] = healthData;

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

    orderedMetadata[index] = unsortedMetaData.find(
      (indicatorMetaData) =>
        Number(indicatorMetaData?.indicatorID) === indicator.indicatorId
    );
  });

  return {
    orderedHealthData,
    orderedGroupData,
    orderedEnglandData,
    orderedMetadata,
    orderedBenchmarkStatistics,
  };
};
