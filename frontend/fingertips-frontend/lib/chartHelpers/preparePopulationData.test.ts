import {
  HealthDataForArea,
  HealthDataPoint,
  HealthDataPointTrendEnum,
} from '@/generated-sources/ft-api-client';
import {
  PopulationDataForArea,
  preparePopulationData,
  PopulationData,
  preparePopulationDataForArea,
} from './preparePopulationData';
import { areaCodeForEngland } from './constants';
import { noDeprivation } from '../mocks';

const mockData: HealthDataPoint[] = [
  {
    year: 2023,
    count: 1496012,
    value: 0,
    lowerCi: 0,
    upperCi: 0,
    ageBand: '0-4',
    sex: 'Female',
    trend: HealthDataPointTrendEnum.NotYetCalculated,
    deprivation: noDeprivation,
  },
  {
    year: 2023,
    count: 1635842,
    value: 0,
    lowerCi: 0,
    upperCi: 0,
    ageBand: '5-9',
    sex: 'Female',
    trend: HealthDataPointTrendEnum.NotYetCalculated,
    deprivation: noDeprivation,
  },
  {
    year: 2023,
    count: 1721746,
    value: 0,
    lowerCi: 0,
    upperCi: 0,
    ageBand: '10-14',
    sex: 'Female',
    trend: HealthDataPointTrendEnum.NotYetCalculated,
    deprivation: noDeprivation,
  },
  {
    year: 2023,
    count: 1652231,
    value: 0,
    lowerCi: 0,
    upperCi: 0,
    ageBand: '15-19',
    sex: 'Female',
    trend: HealthDataPointTrendEnum.NotYetCalculated,
    deprivation: noDeprivation,
  },
  {
    year: 2023,
    count: 1692751,
    value: 0,
    lowerCi: 0,
    upperCi: 0,
    ageBand: '20-24',
    sex: 'Female',
    trend: HealthDataPointTrendEnum.NotYetCalculated,
    deprivation: noDeprivation,
  },
  {
    year: 2023,
    count: 1936763,
    value: 0,
    lowerCi: 0,
    upperCi: 0,
    ageBand: '50-54',
    sex: 'Female',
    trend: HealthDataPointTrendEnum.NotYetCalculated,
    deprivation: noDeprivation,
  },
  {
    year: 2023,
    count: 547342,
    value: 0,
    lowerCi: 0,
    upperCi: 0,
    ageBand: '85-89',
    sex: 'Female',
    trend: HealthDataPointTrendEnum.NotYetCalculated,
    deprivation: noDeprivation,
  },
  {
    year: 2023,
    count: 347835,
    value: 0,
    lowerCi: 0,
    upperCi: 0,
    ageBand: '90+',
    sex: 'Female',
    trend: HealthDataPointTrendEnum.NotYetCalculated,
    deprivation: noDeprivation,
  },
  {
    year: 2023,
    count: 1568625,
    value: 0,
    lowerCi: 0,
    upperCi: 0,
    ageBand: '0-4',
    sex: 'Male',
    trend: HealthDataPointTrendEnum.NotYetCalculated,
    deprivation: noDeprivation,
  },
  {
    year: 2023,
    count: 1712925,
    value: 0,
    lowerCi: 0,
    upperCi: 0,
    ageBand: '5-9',
    sex: 'Male',
    trend: HealthDataPointTrendEnum.NotYetCalculated,
    deprivation: noDeprivation,
  },
  {
    year: 2023,
    count: 1807194,
    value: 0,
    lowerCi: 0,
    upperCi: 0,
    ageBand: '10-14',
    sex: 'Male',
    trend: HealthDataPointTrendEnum.NotYetCalculated,
    deprivation: noDeprivation,
  },
  {
    year: 2023,
    count: 1752832,
    value: 0,
    lowerCi: 0,
    upperCi: 0,
    ageBand: '15-19',
    sex: 'Male',
    trend: HealthDataPointTrendEnum.NotYetCalculated,
    deprivation: noDeprivation,
  },
  {
    year: 2023,
    count: 1763621,
    value: 0,
    lowerCi: 0,
    upperCi: 0,
    ageBand: '20-24',
    sex: 'Male',
    trend: HealthDataPointTrendEnum.NotYetCalculated,
    deprivation: noDeprivation,
  },
  {
    year: 2023,
    count: 1872253,
    value: 0,
    lowerCi: 0,
    upperCi: 0,
    ageBand: '50-54',
    sex: 'Male',
    trend: HealthDataPointTrendEnum.NotYetCalculated,
    deprivation: noDeprivation,
  },

  {
    year: 2023,
    count: 173456,
    value: 0,
    lowerCi: 0,
    upperCi: 0,
    ageBand: '90+',
    sex: 'Male',
    trend: HealthDataPointTrendEnum.NotYetCalculated,
    deprivation: noDeprivation,
  },
  {
    year: 2023,
    count: 377979,
    value: 0,
    lowerCi: 0,
    upperCi: 0,
    ageBand: '85-89',
    sex: 'Male',
    trend: HealthDataPointTrendEnum.NotYetCalculated,
    deprivation: noDeprivation,
  },
];
const mockAgeCategories = [
  '90+',
  '85-89',
  '50-54',
  '20-24',
  '15-19',
  '10-14',
  '5-9',
  '0-4',
];
const mockFemaleSeries = [1.58, 2.48, 8.78, 7.67, 7.49, 7.81, 7.42, 6.78];
const mockMaleSeries = [0.79, 1.71, 8.49, 7.99, 7.95, 8.19, 7.77, 7.11];

const mockHealthDataForSelectedArea: HealthDataForArea = {
  areaCode: 'selected',
  areaName: 'Selected Area',
  healthData: mockData,
};
const mockHealthDataForEngland: HealthDataForArea = {
  areaCode: areaCodeForEngland,
  areaName: 'England',
  healthData: mockData,
};
const mockHealthDataForBaseline: HealthDataForArea = {
  areaCode: 'baseline',
  areaName: 'Baseline Area',
  healthData: mockData,
};

describe('preparePopulationData', () => {
  describe('preparePopulationDataforArea', () => {
    it('should return an object with age categories sorted oldest to youngest', () => {
      const expected = mockAgeCategories;

      const actual: PopulationDataForArea | undefined =
        preparePopulationDataForArea(mockData);
      expect(actual?.ageCategories).toEqual(expected);
    });

    it('should return an object with female population data as a percentage sorted by age band old to youngest', () => {
      const expected = mockFemaleSeries;
      const actual: PopulationDataForArea | undefined =
        preparePopulationDataForArea(mockData);
      expect(actual?.femaleSeries).toEqual(expected);
    });

    it('should return an object with male population data as a percentage sorted by age band sorted old to youngest', () => {
      const expected = mockMaleSeries;
      const actual: PopulationDataForArea | undefined =
        preparePopulationDataForArea(mockData);
      expect(actual?.maleSeries).toEqual(expected);
    });
  });

  it('should return an object with prepared population data for the selected area', () => {
    const expected: PopulationData = {
      dataForSelectedArea: {
        ageCategories: mockAgeCategories,
        femaleSeries: mockFemaleSeries,
        maleSeries: mockMaleSeries,
      },
    };
    const actual: PopulationData = preparePopulationData(
      [mockHealthDataForSelectedArea],
      'selected'
    );
    expect(actual).toEqual(expected);
  });

  it('should return an object with prepared popultion data for the selected area and England', () => {
    const expected: PopulationData = {
      dataForSelectedArea: {
        ageCategories: mockAgeCategories,
        femaleSeries: mockFemaleSeries,
        maleSeries: mockMaleSeries,
      },
      dataForEngland: {
        ageCategories: mockAgeCategories,
        femaleSeries: mockFemaleSeries,
        maleSeries: mockMaleSeries,
      },
    };
    const actual: PopulationData = preparePopulationData(
      [mockHealthDataForSelectedArea, mockHealthDataForEngland],
      'selected'
    );
    expect(actual).toEqual(expected);
  });

  it('should return an object with prepared popultion data for the selected area, England and baseline area', () => {
    const expected: PopulationData = {
      dataForSelectedArea: {
        ageCategories: mockAgeCategories,
        femaleSeries: mockFemaleSeries,
        maleSeries: mockMaleSeries,
      },
      dataForEngland: {
        ageCategories: mockAgeCategories,
        femaleSeries: mockFemaleSeries,
        maleSeries: mockMaleSeries,
      },
      dataForBaseline: {
        ageCategories: mockAgeCategories,
        femaleSeries: mockFemaleSeries,
        maleSeries: mockMaleSeries,
      },
    };
    const actual: PopulationData = preparePopulationData(
      [
        mockHealthDataForSelectedArea,
        mockHealthDataForEngland,
        mockHealthDataForBaseline,
      ],
      'selected',
      'baseline'
    );
    expect(actual).toEqual(expected);
  });
});
