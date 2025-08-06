import { describe, expect, it } from 'vitest';

import {
  Area,
  GetHealthDataForAnIndicatorInequalitiesEnum,
} from '@/generated-sources/ft-api-client';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import {
  adminIndicatorIdForPopulation,
  areaCodeForEngland,
  nhsIndicatorIdForPopulation,
} from '@/lib/chartHelpers/constants';
import { populationPyramidRequestParams } from '@/components/charts/PopulationPyramid/helpers/populationPyramidRequestParams';

describe('populationPyramidRequestParams', () => {
  const availableAreas: Area[] = [];

  it('returns correct request for NHS hierarchy', () => {
    const searchState: SearchStateParams = {
      [SearchParams.AreasSelected]: ['A1'],
      [SearchParams.GroupSelected]: 'G1',
      [SearchParams.AreaTypeSelected]: 'nhs-regions',
    };

    const result = populationPyramidRequestParams(searchState, availableAreas);

    expect(result.indicatorId).toBe(nhsIndicatorIdForPopulation);
    expect(result.areaCodes).toContain('A1');
    expect(result.areaCodes).toContain('G1');
    expect(result.areaCodes).toContain(areaCodeForEngland);
    expect(new Set(result.areaCodes).size).toBe(result.areaCodes?.length); // no duplicates
    expect(result.inequalities).toEqual([
      GetHealthDataForAnIndicatorInequalitiesEnum.Sex,
      GetHealthDataForAnIndicatorInequalitiesEnum.Age,
    ]);
    expect(result.latestOnly).toBe(true);
  });

  it('returns correct request for Administrative regions hierarchy', () => {
    const searchState: SearchStateParams = {
      [SearchParams.AreasSelected]: ['A2'],
      [SearchParams.GroupSelected]: areaCodeForEngland,
      [SearchParams.AreaTypeSelected]: 'regions',
    };

    const result = populationPyramidRequestParams(searchState, availableAreas);

    expect(result.indicatorId).toBe(adminIndicatorIdForPopulation);
    expect(result.areaCodes).toContain('A2');
    expect(result.areaCodes).toContain(areaCodeForEngland);
    expect(result.areaCodes).toHaveLength(2); // no group added because it's England
    expect(result.inequalities).toEqual([
      GetHealthDataForAnIndicatorInequalitiesEnum.Sex,
      GetHealthDataForAnIndicatorInequalitiesEnum.Age,
    ]);
    expect(result.latestOnly).toBe(true);
  });
});
