import { BenchmarkReferenceType } from '@/generated-sources/ft-api-client';
import { SearchParams } from '@/lib/searchStateManager';
import { determineAreaCodes } from '@/lib/chartHelpers/chartHelpers';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { englandAreaType } from '@/lib/areaFilterHelpers/areaType';
import { determineBenchmarkRefType } from '@/lib/ViewsHelpers';
import { oneIndicatorRequestParams } from '@/components/charts/helpers/oneIndicatorRequestParams';
import { MockedFunction } from 'vitest';

vi.mock('@/lib/chartHelpers/chartHelpers');
vi.mock('@/lib/ViewsHelpers');

const mockDetermineAreaCodes = determineAreaCodes as MockedFunction<
  typeof determineAreaCodes
>;
const mockDetermineBenchmarkRefType =
  determineBenchmarkRefType as MockedFunction<typeof determineBenchmarkRefType>;

describe('lineChartOverTimeRequestParams', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('includes england and group area codes if not already in areaCodes', () => {
    mockDetermineAreaCodes.mockReturnValue(['E08000001']);
    mockDetermineBenchmarkRefType.mockReturnValue(
      BenchmarkReferenceType.England
    );

    const searchState = {
      [SearchParams.AreasSelected]: ['E08000001'],
      [SearchParams.IndicatorsSelected]: ['123'],
      [SearchParams.GroupSelected]: 'E92000002',
      [SearchParams.AreaTypeSelected]: 'AreaType1',
      [SearchParams.BenchmarkAreaSelected]: 'some-area',
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
    mockDetermineAreaCodes.mockReturnValue([areaCodeForEngland]);
    mockDetermineBenchmarkRefType.mockReturnValue(
      BenchmarkReferenceType.England
    );

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
    mockDetermineAreaCodes.mockReturnValue(['E08000002']);
    mockDetermineBenchmarkRefType.mockReturnValue(
      BenchmarkReferenceType.SubNational
    );

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
    mockDetermineAreaCodes.mockReturnValue(['E08000003']);
    mockDetermineBenchmarkRefType.mockReturnValue(
      BenchmarkReferenceType.England
    );

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
});
