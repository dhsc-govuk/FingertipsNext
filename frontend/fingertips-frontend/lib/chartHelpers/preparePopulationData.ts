import {
  HealthDataPoint,
  HealthDataForArea,
} from '@/generated-sources/ft-api-client';

export interface PopulationDataForArea {
  areaName?: string;
  areaCode?: string;
  ageCategories: Array<string>;
  femaleSeries: Array<number>;
  maleSeries: Array<number>;
}

function sortByAgeBand(healthData: HealthDataPoint[]): HealthDataPoint[] {
  return healthData.sort((a, b) => {
    const youngestA = parseInt(a.ageBand.split(/[+-]/)[0]);
    const youngestB = parseInt(b.ageBand.split(/[+-]/)[0]);
    return youngestA > youngestB ? -1 : 1;
  });
}

function generatePopulationSeries(
  healthData: HealthDataPoint[],
  requestedKey: string
): Array<number> {
  const totalPopulation = healthData.reduce(
    (runningTotal, { count }) => runningTotal + (count ?? 0),
    0
  );
  const filteredHealthData = healthData.filter(
    (healthDataPoint) => healthDataPoint.sex === requestedKey
  );
  return filteredHealthData.map((datapoint) => {
    const percentage = ((datapoint.count ?? 0) / totalPopulation) * 100;
    return parseFloat(percentage.toFixed(2));
  });
}

/*
 The function will be use to convert population health data to data that can be use by the pyramid chart 
*/
export const convertHealthDataForAreaForPyramidData = (
  healthDataForArea: HealthDataForArea | undefined
): PopulationDataForArea | undefined => {
  if (!healthDataForArea) {
    return undefined;
  }
  const dataSortedByAgeBand = sortByAgeBand(healthDataForArea.healthData);
  let ageCategories = dataSortedByAgeBand.map(
    (healthDataPoint) => healthDataPoint.ageBand
  );
  ageCategories = [...new Set(ageCategories)];

  const femaleSeries = generatePopulationSeries(
    healthDataForArea.healthData,
    'Female'
  );
  const maleSeries = generatePopulationSeries(
    healthDataForArea.healthData,
    'Male'
  );

  return {
    areaName: healthDataForArea.areaName,
    areaCode: healthDataForArea.areaCode,
    ageCategories: ageCategories,
    femaleSeries: femaleSeries,
    maleSeries: maleSeries,
  };
};
