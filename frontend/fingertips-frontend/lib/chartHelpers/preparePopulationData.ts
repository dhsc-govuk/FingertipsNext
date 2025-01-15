import {
  HealthDataForArea,
  HealthDataPoint,
} from '@/generated-sources/ft-api-client';

export interface PopulationData {
  ageCategories: Array<string>;
  femaleSeries: Array<number>;
}

export function preparePopulationData(
  data: HealthDataForArea[]
): PopulationData {
  // NOTE: for mock data this is just the first area, it will need to become for selected/england/baseline
  const dataSortedByAgeBand = sortByAgeBand(data[0].healthData);
  // get the age categories
  let ageCategories = dataSortedByAgeBand.map(
    (healthDataPoint) => healthDataPoint.ageBand
  );
  ageCategories = [...new Set(ageCategories)];

  const femaleSeries = generatePopulationSeries(data[0].healthData);

  return { ageCategories: ageCategories, femaleSeries: femaleSeries };
}

function sortByAgeBand(healthData: HealthDataPoint[]): HealthDataPoint[] {
  const dataSortedByAgeBand = healthData.sort((a, b) => {
    const youngestA = parseInt(a.ageBand.split(/[+-]/)[0]);
    const youngestB = parseInt(b.ageBand.split(/[+-]/)[0]);
    return youngestA > youngestB ? -1 : 1;
  });
  return dataSortedByAgeBand;
}

function generatePopulationSeries(
  healthData: HealthDataPoint[]
): Array<number> {}
