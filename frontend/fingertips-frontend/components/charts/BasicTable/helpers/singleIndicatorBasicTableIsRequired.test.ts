import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { singleIndicatorBasicTableIsRequired } from '@/components/charts/BasicTable/helpers/singleIndicatorBasicTableIsRequired';

describe('singleIndicatorBasicTableIsRequired', () => {
  it('returns true when the first selected area is areaCodeForEngland', () => {
    const state: SearchStateParams = {
      [SearchParams.AreasSelected]: [areaCodeForEngland],
    };
    expect(singleIndicatorBasicTableIsRequired(state)).toBe(true);
  });

  it('returns true when areaTypeSelected is "england"', () => {
    const state: SearchStateParams = {
      [SearchParams.AreaTypeSelected]: 'england',
    };
    expect(singleIndicatorBasicTableIsRequired(state)).toBe(true);
  });

  it('returns false when groupAreaSelected is ALL_AREAS_SELECTED', () => {
    const state: SearchStateParams = {
      [SearchParams.GroupAreaSelected]: ALL_AREAS_SELECTED,
    };
    expect(singleIndicatorBasicTableIsRequired(state)).toBe(false);
  });

  it('returns true when areasSelected is an empty array', () => {
    const state: SearchStateParams = {
      [SearchParams.AreasSelected]: [],
    };
    expect(singleIndicatorBasicTableIsRequired(state)).toBe(true);
  });

  it('returns false in default case (no matches)', () => {
    const state: SearchStateParams = {};
    expect(singleIndicatorBasicTableIsRequired(state)).toBe(false);
  });
});
