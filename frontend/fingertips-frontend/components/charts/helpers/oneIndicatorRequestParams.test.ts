import { BenchmarkReferenceType } from '@/generated-sources/ft-api-client';
import { SearchParams } from '@/lib/searchStateManager';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { englandAreaType } from '@/lib/areaFilterHelpers/areaType';
import { oneIndicatorRequestParams } from '@/components/charts/helpers/oneIndicatorRequestParams';
import { mockArea } from '@/mock/data/mockArea';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';

describe('lineChartOverTimeRequestParams', () => {
  it('includes england and group area codes if not already in areaCodes', () => {
    const searchState = {
      [SearchParams.AreasSelected]: ['E08000001'],
      [SearchParams.IndicatorsSelected]: ['123'],
      [SearchParams.GroupSelected]: 'E92000002',
      [SearchParams.AreaTypeSelected]: 'AreaType1',
    };

    const result = oneIndicatorRequestParams(searchState, []);

    expect(result).toEqual({
      indicatorId: 123,
      areaCodes: ['E08000001', areaCodeForEngland, 'E92000002'],
      areaType: 'AreaType1',
      benchmarkRefType: BenchmarkReferenceType.England,
      ancestorCode: undefined,
    });
  });

  it('uses englandAreaType.key if area code is England', () => {
    const searchState = {
      [SearchParams.AreasSelected]: [areaCodeForEngland],
      [SearchParams.IndicatorsSelected]: ['456'],
      [SearchParams.GroupSelected]: areaCodeForEngland,
      [SearchParams.AreaTypeSelected]: 'OriginalAreaType',
      [SearchParams.BenchmarkAreaSelected]: 'eng-benchmark',
    };

    const result = oneIndicatorRequestParams(searchState, []);

    expect(result.areaType).toBe(englandAreaType.key);
  });

  it('sets ancestorCode if benchmarkRefType is SubNational', () => {
    const searchState = {
      [SearchParams.AreasSelected]: ['E08000002'],
      [SearchParams.IndicatorsSelected]: ['789'],
      [SearchParams.GroupSelected]: 'E10000012',
      [SearchParams.AreaTypeSelected]: 'AnotherType',
      [SearchParams.BenchmarkAreaSelected]: 'bench-subnat',
    };

    const result = oneIndicatorRequestParams(searchState, []);

    expect(result.ancestorCode).toBe('E10000012');
  });

  it('handles missing groupSelected gracefully', () => {
    const searchState = {
      [SearchParams.AreasSelected]: ['E08000003'],
      [SearchParams.IndicatorsSelected]: ['321'],
      [SearchParams.AreaTypeSelected]: 'AnyArea',
      [SearchParams.BenchmarkAreaSelected]: 'nat-benchmark',
    };

    const result = oneIndicatorRequestParams(searchState, []);

    expect(result.areaCodes).toContain(areaCodeForEngland);
    expect(result.ancestorCode).toBeUndefined();
  });

  it('returns all available areas if GroupAreaSelected is ALL', () => {
    const searchState = {
      [SearchParams.AreasSelected]: [],
      [SearchParams.IndicatorsSelected]: ['123'],
      [SearchParams.GroupSelected]: 'E92000002',
      [SearchParams.GroupAreaSelected]: ALL_AREAS_SELECTED,
      [SearchParams.AreaTypeSelected]: 'AreaType1',
    };

    const availableAreas = [
      mockArea({ code: 'A1' }),
      mockArea({ code: 'A2' }),
      mockArea({ code: 'A3' }),
      mockArea({ code: 'A4' }),
    ];

    const result = oneIndicatorRequestParams(searchState, availableAreas);

    expect(result).toEqual({
      indicatorId: 123,
      areaCodes: ['A1', 'A2', 'A3', 'A4', areaCodeForEngland, 'E92000002'],
      areaType: 'AreaType1',
      benchmarkRefType: BenchmarkReferenceType.England,
      ancestorCode: undefined,
    });
  });
});
