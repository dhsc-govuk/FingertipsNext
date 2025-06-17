import { determineAreaCodes } from '@/lib/chartHelpers/chartHelpers';
import { lineChartOverTimeIsRequired } from './lineChartOverTimeIsRequired';
import { SearchParams } from '@/lib/searchStateManager';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';

jest.mock('@/lib/chartHelpers/chartHelpers');

const mockDetermineAreaCodes = determineAreaCodes as jest.MockedFunction<
  typeof determineAreaCodes
>;

describe('lineChartOverTimeIsRequired', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns true if areaTypeSelected is england and the only area code is england', () => {
    mockDetermineAreaCodes.mockReturnValue([areaCodeForEngland]);
    const searchState = {
      [SearchParams.AreaTypeSelected]: 'england',
      [SearchParams.AreasSelected]: [],
      [SearchParams.IndicatorsSelected]: ['ind1'],
    };

    const result = lineChartOverTimeIsRequired(searchState);
    expect(result).toBe(true);
  });

  it('returns false if groupAreaSelected is ALL_AREAS_SELECTED', () => {
    const searchState = {
      [SearchParams.GroupAreaSelected]: ALL_AREAS_SELECTED,
      [SearchParams.AreasSelected]: ['A', 'B'],
      [SearchParams.IndicatorsSelected]: ['ind1'],
    };

    const result = lineChartOverTimeIsRequired(searchState);
    expect(result).toBe(false);
  });

  it('returns false if more than 2 area codes', () => {
    const searchState = {
      [SearchParams.GroupAreaSelected]: 'someGroup',
      [SearchParams.AreasSelected]: ['A', 'B', 'C'],
      [SearchParams.IndicatorsSelected]: ['ind1'],
    };

    mockDetermineAreaCodes.mockReturnValue(['A', 'B', 'C']);

    const result = lineChartOverTimeIsRequired(searchState);
    expect(result).toBe(false);
  });

  it('returns false if not exactly 1 indicator', () => {
    const searchState = {
      [SearchParams.GroupAreaSelected]: 'someGroup',
      [SearchParams.AreasSelected]: ['A'],
      [SearchParams.IndicatorsSelected]: ['ind1', 'ind2'],
    };

    mockDetermineAreaCodes.mockReturnValue(['A']);

    const result = lineChartOverTimeIsRequired(searchState);
    expect(result).toBe(false);
  });

  it('returns false if no area codes are returned', () => {
    const searchState = {
      [SearchParams.GroupAreaSelected]: 'someGroup',
      [SearchParams.AreasSelected]: [],
      [SearchParams.IndicatorsSelected]: ['ind1'],
    };

    mockDetermineAreaCodes.mockReturnValue([]);

    const result = lineChartOverTimeIsRequired(searchState);
    expect(result).toBe(false);
  });

  it('returns true for valid case: group area not ALL, ≤2 areas, 1 indicator', () => {
    const searchState = {
      [SearchParams.GroupAreaSelected]: 'someGroup',
      [SearchParams.AreasSelected]: ['A'],
      [SearchParams.IndicatorsSelected]: ['ind1'],
    };

    mockDetermineAreaCodes.mockReturnValue(['A']);

    const result = lineChartOverTimeIsRequired(searchState);
    expect(result).toBe(true);
  });
});
