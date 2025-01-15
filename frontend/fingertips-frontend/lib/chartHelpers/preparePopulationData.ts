import {
  HealthDataForArea,
  HealthDataPoint,
} from '@/generated-sources/ft-api-client';
import { accumulateViewport } from 'next/dist/lib/metadata/resolve-metadata';

export interface PopulationData {
  ageCategories: Array<string>;
  femaleSeries: Array<number>;
  maleSeries: Array<number>;
}

export function preparePopulationData(
  healthData: HealthDataPoint[]
): PopulationData {
  // NOTE: for mock data this is just the first area, it will need to become for selected/england/baseline
  const dataSortedByAgeBand = sortByAgeBand(healthData);
  // get the age categories
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
  const dataSortedByAgeBand = healthData.sort((a, b) => {
    const youngestA = parseInt(a.ageBand.split(/[+-]/)[0]);
    const youngestB = parseInt(b.ageBand.split(/[+-]/)[0]);
    return youngestA > youngestB ? -1 : 1;
  });
  return dataSortedByAgeBand;
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
  const seriesData = filteredHealthData.map((datapoint) => {
    const percentage = (datapoint.count / totalPopulation) * 100;
    return parseFloat(percentage.toFixed(2));
  });
  return seriesData;
}
