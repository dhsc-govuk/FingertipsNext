import {
  HealthDataForArea,
  HealthDataPoint,
} from '@/generated-sources/ft-api-client';
import { areaCodeForEngland } from './constants';

export interface PopulationDataForArea {
  areaName: string;
  ageCategories: Array<string>;
  femaleSeries: Array<number>;
  maleSeries: Array<number>;
}

export type PopulationData = {
  dataForEngland?: PopulationDataForArea;
  dataForBaseline?: PopulationDataForArea;
};

export function preparePopulationData(
  rawData: HealthDataForArea,
  selectedAreaCode?: string,
  baselineAreaCode?: string
): [PopulationDataForArea | undefined, PopulationData] {
  const rawDataForEngland: HealthDataForArea | undefined = rawData.find(
    (dataForArea) => dataForArea.areaCode == areaCodeForEngland
  );
  const rawDataForSelected: HealthDataForArea | undefined = rawData.find(
    (dataForArea) => dataForArea.areaCode == selectedAreaCode
  );
  const rawDataForBaseline: HealthDataForArea | undefined = rawData.find(
    (dataForArea) => dataForArea.areaCode == baselineAreaCode
  );
  const areaSelectedData = preparePopulationDataForArea(
    rawDataForSelected?.healthData
  );
  return [
    areaSelectedData,
    {
      dataForEngland: preparePopulationDataForArea(
        rawDataForEngland?.healthData
      ),
      dataForBaseline: preparePopulationDataForArea(
        rawDataForBaseline?.healthData
      ),
    },
  ];
}

export function preparePopulationDataForArea(
  healthData?: HealthDataPoint[]
): PopulationDataForArea | undefined {
  if (!healthData) {
    return undefined;
  }
  const dataSortedByAgeBand = sortByAgeBand(healthData);
  let ageCategories = dataSortedByAgeBand.map(
    (healthDataPoint) => healthDataPoint.ageBand
  );
  ageCategories = [...new Set(ageCategories)];

  const femaleSeries = generatePopulationSeries(healthData, 'Female');
  const maleSeries = generatePopulationSeries(healthData, 'Male');

  return {
    areaName: '',
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
