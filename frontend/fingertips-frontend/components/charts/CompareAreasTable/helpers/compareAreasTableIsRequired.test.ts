import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';
import { compareAreasTableIsRequired } from '@/components/charts/CompareAreasTable/helpers/compareAreasTableIsRequired';

describe('compareAreasTableIsRequired', () => {
  const indicatorKey = SearchParams.IndicatorsSelected;
  const areasKey = SearchParams.AreasSelected;
  const groupKey = SearchParams.GroupAreaSelected;

  it('returns false if no indicators are selected', () => {
    const searchState: SearchStateParams = {
      [indicatorKey]: [],
      [areasKey]: ['area1', 'area2'],
      [groupKey]: 'some-group',
    };
    expect(compareAreasTableIsRequired(searchState)).toBe(false);
  });

  it('returns true if group area is ALL_AREAS_SELECTED', () => {
    const searchState: SearchStateParams = {
      [indicatorKey]: ['ind1'],
      [areasKey]: ['area1'],
      [groupKey]: ALL_AREAS_SELECTED,
    };
    expect(compareAreasTableIsRequired(searchState)).toBe(true);
  });

  it('returns false if no areas are selected', () => {
    const searchState: SearchStateParams = {
      [indicatorKey]: ['ind1'],
      [areasKey]: [],
      [groupKey]: 'some-group',
    };
    expect(compareAreasTableIsRequired(searchState)).toBe(false);
  });

  it('returns false if only one area is selected', () => {
    const searchState: SearchStateParams = {
      [indicatorKey]: ['ind1'],
      [areasKey]: ['area1'],
      [groupKey]: 'some-group',
    };
    expect(compareAreasTableIsRequired(searchState)).toBe(false);
  });

  it('returns true if multiple areas are selected', () => {
    const searchState: SearchStateParams = {
      [indicatorKey]: ['ind1'],
      [areasKey]: ['area1', 'area2'],
      [groupKey]: 'some-group',
    };
    expect(compareAreasTableIsRequired(searchState)).toBe(true);
  });
});
