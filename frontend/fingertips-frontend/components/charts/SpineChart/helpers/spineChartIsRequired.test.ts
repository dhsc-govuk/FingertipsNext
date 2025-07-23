import { SearchParams } from '@/lib/searchStateManager';
import { spineChartIsRequired } from '@/components/charts/SpineChart/helpers/spineChartIsRequired';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';

describe('spineChartIsRequired', () => {
  it('returns true when areaCodes.length <= 2, indicatorsSelected.length >= 2, and groupAreaSelected !== ALL_AREAS_SELECTED', () => {
    const searchState = {
      [SearchParams.AreasSelected]: ['A1', 'A2'],
      [SearchParams.IndicatorsSelected]: ['100', '101'],
      [SearchParams.GroupAreaSelected]: 'GROUP_X',
    };

    const result = spineChartIsRequired(searchState);
    expect(result).toBe(true);
  });

  it('returns false when areaCodes.length > 2', () => {
    const searchState = {
      [SearchParams.AreasSelected]: ['A1', 'A2', 'A3'],
      [SearchParams.IndicatorsSelected]: ['100', '101'],
      [SearchParams.GroupAreaSelected]: 'GROUP_X',
    };

    const result = spineChartIsRequired(searchState);
    expect(result).toBe(false);
  });

  it('returns false when groupAreaSelected is ALL_AREAS_SELECTED', () => {
    const searchState = {
      [SearchParams.AreasSelected]: ['A1', 'A2'],
      [SearchParams.IndicatorsSelected]: ['100', '101'],
      [SearchParams.GroupAreaSelected]: ALL_AREAS_SELECTED,
    };

    const result = spineChartIsRequired(searchState);
    expect(result).toBe(false);
  });

  it('returns false when all conditions fail', () => {
    const searchState = {
      [SearchParams.AreasSelected]: ['A1', 'A2', 'A3'],
      [SearchParams.IndicatorsSelected]: ['101'],
      [SearchParams.GroupAreaSelected]: ALL_AREAS_SELECTED,
    };

    const result = spineChartIsRequired(searchState);
    expect(result).toBe(false);
  });
});
