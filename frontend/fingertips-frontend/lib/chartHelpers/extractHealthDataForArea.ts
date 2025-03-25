import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';

type ExtractedHealthData = {
  healthIndicatorData: HealthDataForArea[];
  groupIndicatorData: HealthDataForArea[];
  englandIndicatorData: HealthDataForArea[];
};

export const extractingCombinedHealthData = (
  combinedIndicatorData: HealthDataForArea[][],
  areasSelected: string[],
  selectedGroupCode?: string
): ExtractedHealthData => {
  const healthIndicatorData: HealthDataForArea[] = new Array(
    combinedIndicatorData.length
  );
  const groupIndicatorData: HealthDataForArea[] = new Array(
    combinedIndicatorData.length
  );
  const englandIndicatorData: HealthDataForArea[] = new Array(
    combinedIndicatorData.length
  );
  combinedIndicatorData.map((indicator, index) => {
    //console.log(`indicator ${JSON.stringify(indicator)}`);
    const healthData = indicator.find(
      (areaData) => areaData.areaCode === areasSelected[0]
    );

    if (!healthData) {
      throw new Error('Missing health data for indicator');
    }
    healthIndicatorData[index] = healthData;

    const groupData = indicator.find(
      (areaData) => areaData.areaCode === selectedGroupCode
    );

    if (!groupData) {
      throw new Error('Missing group health data for indicator');
    }
    groupIndicatorData[index] = groupData;

    const englandData = indicator.find(
      (areaData) => areaData.areaCode === areaCodeForEngland
    );

    if (!englandData) {
      throw new Error('Missing England health data for indicator');
    }
    englandIndicatorData[index] = englandData;
  });

  return { healthIndicatorData, groupIndicatorData, englandIndicatorData };
};
