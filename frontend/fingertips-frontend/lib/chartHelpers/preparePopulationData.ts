import { HealthDataPoint } from '@/generated-sources/ft-api-client';

export interface PopulationData {
  ageCategories: Array<string>;
  femaleSeries: Array<number>;
  maleSeries: Array<number>;
}

export function preparePopulationData(
  healthData: HealthDataPoint[]
): PopulationData {
  const dataSortedByAgeBand = sortByAgeBand(healthData);
  let ageCategories = dataSortedByAgeBand.map(
    (healthDataPoint) => healthDataPoint.ageBand
  );
  ageCategories = [...new Set(ageCategories)];

  const femaleSeries = generatePopulationSeries(healthData, 'Female');
  const maleSeries = generatePopulationSeries(healthData, 'Male');

  return {
    ageCategories: ageCategories,
    femaleSeries: femaleSeries,
    maleSeries: maleSeries,
  };
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
    (runningTotal, { count }) => runningTotal + count,
    0
  );
  const filteredHealthData = healthData.filter(
    (healthDataPoint) => healthDataPoint.sex === requestedKey
  );
  return filteredHealthData.map((datapoint) => {
    const percentage = (datapoint.count / totalPopulation) * 100;
    return parseFloat(percentage.toFixed(2));
  });
}
