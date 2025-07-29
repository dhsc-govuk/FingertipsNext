import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';
import { heatMapIsRequired } from '@/components/charts/HeatMap/helpers/heatMapIsRequired';

describe('heatMapIsRequired', () => {
  it('returns false when areaTypeSelected is "england"', () => {
    const input: SearchStateParams = {
      [SearchParams.AreaTypeSelected]: 'england',
      [SearchParams.AreasSelected]: [],
      [SearchParams.GroupAreaSelected]: '',
      [SearchParams.IndicatorsSelected]: ['indicator1'],
    };
    expect(heatMapIsRequired(input)).toBe(false);
  });

  it('returns false when only 1 indicator and <=2 area codes, and group area is not ALL_AREAS_SELECTED', () => {
    const input: SearchStateParams = {
      [SearchParams.AreaTypeSelected]: 'regions',
      [SearchParams.AreasSelected]: ['area1', areaCodeForEngland],
      [SearchParams.GroupAreaSelected]: 'group1',
      [SearchParams.IndicatorsSelected]: ['indicator1'],
    };
    expect(heatMapIsRequired(input)).toBe(false);
  });

  it('returns true when groupAreaSelected is ALL_AREAS_SELECTED', () => {
    const input: SearchStateParams = {
      [SearchParams.AreaTypeSelected]: 'regions',
      [SearchParams.AreasSelected]: [],
      [SearchParams.GroupAreaSelected]: ALL_AREAS_SELECTED,
      [SearchParams.IndicatorsSelected]: ['indicator1'],
    };
    expect(heatMapIsRequired(input)).toBe(true);
  });

  it('returns true when more than 2 area codes after filtering out areaCodeForEngland', () => {
    const input: SearchStateParams = {
      [SearchParams.AreaTypeSelected]: 'regions',
      [SearchParams.AreasSelected]: [
        'area1',
        'area2',
        'area3',
        areaCodeForEngland,
      ],
      [SearchParams.GroupAreaSelected]: 'group1',
      [SearchParams.IndicatorsSelected]: ['indicator1'],
    };
    expect(heatMapIsRequired(input)).toBe(true);
  });

  it('returns false when areaCodes after filtering are empty and indicator condition met', () => {
    const input: SearchStateParams = {
      [SearchParams.AreaTypeSelected]: 'regions',
      [SearchParams.AreasSelected]: [areaCodeForEngland],
      [SearchParams.GroupAreaSelected]: 'group1',
      [SearchParams.IndicatorsSelected]: ['indicator1'],
    };
    expect(heatMapIsRequired(input)).toBe(false);
  });
});
