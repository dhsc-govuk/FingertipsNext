import { compareAreasTableRequestParams } from '@/components/charts/CompareAreasTable/helpers/compareAreasTableRequestParams';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import {
  Area,
  BenchmarkReferenceType,
} from '@/generated-sources/ft-api-client';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';

import { determineBenchmarkRefType } from '@/lib/ViewsHelpers';
import { determineAreaCodes } from '@/lib/chartHelpers/chartHelpers';
import { MockedFunction } from 'vitest';

vi.mock('@/lib/ViewsHelpers');
vi.mock('@/lib/chartHelpers/chartHelpers');

const mockDetermineBenchmarkRefType =
  determineBenchmarkRefType as MockedFunction<typeof determineBenchmarkRefType>;
const mockDetermineAreaCodes = determineAreaCodes as MockedFunction<
  typeof determineAreaCodes
>;

describe('compareAreasTableRequestParams', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('builds request params with all area codes, including England and group if missing', () => {
    const searchState = {
      [SearchParams.IndicatorsSelected]: ['101'],
      [SearchParams.GroupSelected]: 'GROUP1',
      [SearchParams.AreaTypeSelected]: 'UTLA',
      [SearchParams.AreasSelected]: ['A1', 'A2'],
      [SearchParams.BenchmarkAreaSelected]: 'BENCHMARK_X',
      [SearchParams.GroupAreaSelected]: 'G_AREA',
    };

    const availableAreas: Area[] = [
      { code: 'A1', name: 'Area 1' },
      { code: 'A2', name: 'Area 2' },
    ] as Area[];

    mockDetermineBenchmarkRefType.mockReturnValue(
      BenchmarkReferenceType.England
    );
    mockDetermineAreaCodes.mockReturnValue(['A1', 'A2']);

    const result = compareAreasTableRequestParams(searchState, availableAreas);

    expect(result).toEqual({
      indicatorId: 101,
      areaType: 'UTLA',
      benchmarkRefType: BenchmarkReferenceType.England,
      ancestorCode: undefined,
      areaCodes: ['A1', 'A2', areaCodeForEngland, 'GROUP1'],
    });

    expect(mockDetermineBenchmarkRefType).toHaveBeenCalledWith('BENCHMARK_X');
    expect(mockDetermineAreaCodes).toHaveBeenCalledWith(
      ['A1', 'A2'],
      'G_AREA',
      availableAreas
    );
  });

  it('adds ancestorCode when benchmarkRefType is SubNational', () => {
    const searchState: SearchStateParams = {
      [SearchParams.IndicatorsSelected]: ['102'],
      [SearchParams.GroupSelected]: 'GROUPX',
      [SearchParams.AreaTypeSelected]: 'LTLA',
      [SearchParams.AreasSelected]: [],
      [SearchParams.BenchmarkAreaSelected]: 'SUB_NATIONAL_BM',
    };

    const availableAreas: Area[] = [];

    mockDetermineBenchmarkRefType.mockReturnValue(
      BenchmarkReferenceType.SubNational
    );
    mockDetermineAreaCodes.mockReturnValue([]);

    const result = compareAreasTableRequestParams(searchState, availableAreas);

    expect(result).toEqual({
      indicatorId: 102,
      areaType: 'LTLA',
      benchmarkRefType: BenchmarkReferenceType.SubNational,
      ancestorCode: 'GROUPX',
      areaCodes: [areaCodeForEngland, 'GROUPX'],
    });

    expect(mockDetermineBenchmarkRefType).toHaveBeenCalledWith(
      'SUB_NATIONAL_BM'
    );
  });

  it('handles missing indicatorIds gracefully', () => {
    const searchState: SearchStateParams = {
      [SearchParams.IndicatorsSelected]: [],
      [SearchParams.AreaTypeSelected]: 'C1',
      [SearchParams.AreasSelected]: [],
    };

    mockDetermineBenchmarkRefType.mockReturnValue(
      BenchmarkReferenceType.England
    );
    mockDetermineAreaCodes.mockReturnValue([]);

    const result = compareAreasTableRequestParams(searchState, []);

    expect(result.indicatorId).toBe(0); // because Number('') = 0
    expect(result.areaCodes).toEqual([areaCodeForEngland]);
    expect(result.ancestorCode).toBeUndefined();
  });
});
