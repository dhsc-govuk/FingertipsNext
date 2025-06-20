import {
  BenchmarkReferenceType,
  GetHealthDataForAnIndicatorInequalitiesEnum,
} from '@/generated-sources/ft-api-client';

import { SearchParams } from '@/lib/searchStateManager';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { englandAreaType } from '@/lib/areaFilterHelpers/areaType';

import { inequalitiesRequestParams } from '@/components/charts/Inequalities/helpers/inequalitiesRequestParams';

describe('inequalitiesRequestParams', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('constructs the request params correctly', () => {
    const searchState = {
      [SearchParams.AreasSelected]: ['area1', 'area2'],
      [SearchParams.IndicatorsSelected]: ['123'],
      [SearchParams.GroupSelected]: 'group1',
      [SearchParams.AreaTypeSelected]: 'AreaTypeX',
      [SearchParams.BenchmarkAreaSelected]: 'benchmark1',
    };

    const result = inequalitiesRequestParams(searchState);

    expect(result).toEqual({
      indicatorId: 123,
      areaCodes: ['area1', 'area2', areaCodeForEngland, 'group1'],
      areaType: 'AreaTypeX',
      benchmarkRefType: BenchmarkReferenceType.SubNational,
      ancestorCode: 'group1',
      inequalities: [
        GetHealthDataForAnIndicatorInequalitiesEnum.Sex,
        GetHealthDataForAnIndicatorInequalitiesEnum.Deprivation,
      ],
    });
  });

  it('uses englandAreaType if first area is England', () => {
    const searchState = {
      [SearchParams.AreasSelected]: [areaCodeForEngland],
      [SearchParams.IndicatorsSelected]: ['456'],
      [SearchParams.GroupSelected]: 'group2',
      [SearchParams.BenchmarkAreaSelected]: 'benchmark2',
    };

    const result = inequalitiesRequestParams(searchState);

    expect(result.areaType).toBe(englandAreaType.key);
  });

  it('excludes ancestorCode if not SubNational', () => {
    const searchState = {
      [SearchParams.AreasSelected]: ['areaA'],
      [SearchParams.IndicatorsSelected]: ['789'],
      [SearchParams.GroupSelected]: 'groupX',
      [SearchParams.AreaTypeSelected]: 'TypeZ',
      [SearchParams.BenchmarkAreaSelected]: areaCodeForEngland,
    };

    const result = inequalitiesRequestParams(searchState);

    expect(result.ancestorCode).toBeUndefined();
  });
});
