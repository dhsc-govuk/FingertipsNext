import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { PopulationData, preparePopulationData } from './preparePopulationData';

const mockData: HealthDataForArea[] = [
  {
    areaCode: 'POPULATION TEST',
    healthData: [
      {
        year: 2023,
        count: 1496012,
        value: 0,
        lowerCi: 0,
        upperCi: 0,
        ageBand: '0-4',
        sex: 'Female',
      },
      {
        year: 2023,
        count: 1635842,
        value: 0,
        lowerCi: 0,
        upperCi: 0,
        ageBand: '5-9',
        sex: 'Female',
      },
      {
        year: 2023,
        count: 1721746,
        value: 0,
        lowerCi: 0,
        upperCi: 0,
        ageBand: '10-14',
        sex: 'Female',
      },
      {
        year: 2023,
        count: 1652231,
        value: 0,
        lowerCi: 0,
        upperCi: 0,
        ageBand: '15-19',
        sex: 'Female',
      },
      {
        year: 2023,
        count: 1692751,
        value: 0,
        lowerCi: 0,
        upperCi: 0,
        ageBand: '20-24',
        sex: 'Female',
      },
      {
        year: 2023,
        count: 1936763,
        value: 0,
        lowerCi: 0,
        upperCi: 0,
        ageBand: '50-54',
        sex: 'Female',
      },
      {
        year: 2023,
        count: 547342,
        value: 0,
        lowerCi: 0,
        upperCi: 0,
        ageBand: '85-89',
        sex: 'Female',
      },
      {
        year: 2023,
        count: 347835,
        value: 0,
        lowerCi: 0,
        upperCi: 0,
        ageBand: '90+',
        sex: 'Female',
      },
      {
        year: 2023,
        count: 1568625,
        value: 0,
        lowerCi: 0,
        upperCi: 0,
        ageBand: '0-4',
        sex: 'Male',
      },
      {
        year: 2023,
        count: 1712925,
        value: 0,
        lowerCi: 0,
        upperCi: 0,
        ageBand: '5-9',
        sex: 'Male',
      },
      {
        year: 2023,
        count: 1807194,
        value: 0,
        lowerCi: 0,
        upperCi: 0,
        ageBand: '10-14',
        sex: 'Male',
      },
      {
        year: 2023,
        count: 1752832,
        value: 0,
        lowerCi: 0,
        upperCi: 0,
        ageBand: '15-19',
        sex: 'Male',
      },
      {
        year: 2023,
        count: 1763621,
        value: 0,
        lowerCi: 0,
        upperCi: 0,
        ageBand: '20-24',
        sex: 'Male',
      },
      {
        year: 2023,
        count: 1872253,
        value: 0,
        lowerCi: 0,
        upperCi: 0,
        ageBand: '50-54',
        sex: 'Male',
      },

      {
        year: 2023,
        count: 173456,
        value: 0,
        lowerCi: 0,
        upperCi: 0,
        ageBand: '90+',
        sex: 'Male',
      },
      {
        year: 2023,
        count: 377979,
        value: 0,
        lowerCi: 0,
        upperCi: 0,
        ageBand: '85-89',
        sex: 'Male',
      },
    ],
  },
];

describe('processPopulationData', () => {
  it('should return an object with age categories sorted oldest to youngest', () => {
    const expected: PopulationData = {
      ageCategories: [
        '90+',
        '85-89',
        '50-54',
        '20-24',
        '15-19',
        '10-14',
        '5-9',
        '0-4',
      ],
      femaleSeries: [],
    };

    const actual: PopulationData = preparePopulationData(mockData);
    expect(actual).toEqual(expected);
  });
  // Female Data
  it('should return and objcet with female population data sorted old to youngest', () => {
    const expected: PopulationData = {
      ageCategories: [],
      femaleSeries: [],
    };

    const actual: PopulationData = preparePopulationData(mockData);
    expect(actual).toEqual(expected);
  });

  // Male Data
});
