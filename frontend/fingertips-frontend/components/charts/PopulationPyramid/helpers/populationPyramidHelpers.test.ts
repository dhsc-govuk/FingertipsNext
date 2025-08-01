import { PopulationDataForArea } from '@/components/charts/PopulationPyramid/helpers/preparePopulationData';
import {
  determineHeaderTitle,
  determinePopulationDataForArea,
} from './populationPyramidHelpers';
import {
  HealthDataForArea,
  HealthDataPoint,
} from '@/generated-sources/ft-api-client';
import { nhsRegionsAreaType } from '@/lib/areaFilterHelpers/areaType';
import { generateMockHealthDataPoint } from '../../../organisms/ViewsWrapper/hasSufficientHealthDataCheck.test';

const generatePopulationDataForArea = (
  areaCode: string
): PopulationDataForArea => ({
  areaCode,
  ageCategories: [],
  femaleSeries: [],
  maleSeries: [],
  total: 100,
});

const generateHealthDataForArea = (
  areaCode: string,
  areaName: string,
  healthData: HealthDataPoint[]
): HealthDataForArea => ({
  areaCode,
  areaName,
  healthData,
});

describe('determineHeaderTitle', () => {
  it('should return an empty string when no healthDataForAreaSelected is provided', () => {
    const result = determineHeaderTitle();
    expect(result).toEqual('');
  });

  it('should return the correct title when healthDataForAreaSelected is provided', () => {
    const areaTypeSelected = nhsRegionsAreaType.key;
    const result = determineHeaderTitle(
      generateHealthDataForArea('A001', 'Area 1', [
        generateMockHealthDataPoint(2022),
      ]),
      areaTypeSelected,
      2022
    );
    expect(result).toEqual('Area 1 registered population, 2022');
  });
});

describe('determinePopulationDataForArea', () => {
  it('returns the first area when no areaToFind is provided', () => {
    const populationDataForAllAreas: PopulationDataForArea[] = [
      generatePopulationDataForArea('A001'),
      generatePopulationDataForArea('A002'),
    ];
    const availableAreas = [
      { code: 'A001', name: 'Area 1' },
      { code: 'A002', name: 'Area 2' },
    ];

    const result = determinePopulationDataForArea(
      populationDataForAllAreas,
      availableAreas
    );

    expect(result?.areaCode).toEqual('A001');
  });

  it('returns the area data for the specified areaToFind', () => {
    const populationDataForAllAreas: PopulationDataForArea[] = [
      generatePopulationDataForArea('A001'),
      generatePopulationDataForArea('A002'),
    ];
    const availableAreas = [
      { code: 'A001', name: 'Area 1' },
      { code: 'A002', name: 'Area 2' },
    ];

    const result = determinePopulationDataForArea(
      populationDataForAllAreas,
      availableAreas,
      'A002'
    );

    expect(result?.areaCode).toEqual('A002');
  });

  it('returns undefined when areaToFind is not in availableAreas', () => {
    const populationDataForAllAreas: PopulationDataForArea[] = [
      generatePopulationDataForArea('A001'),
      generatePopulationDataForArea('A002'),
    ];
    const availableAreas = [
      { code: 'A001', name: 'Area 1' },
      { code: 'A002', name: 'Area 2' },
    ];

    const result = determinePopulationDataForArea(
      populationDataForAllAreas,
      availableAreas,
      'A003'
    );

    expect(result).toBeUndefined();
  });
});
