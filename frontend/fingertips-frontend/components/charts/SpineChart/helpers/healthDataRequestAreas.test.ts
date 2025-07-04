import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { SearchParams } from '@/lib/searchStateManager';
import { healthDataRequestAreas } from './healthDataRequestAreas';
import { englandAreaType } from '@/lib/areaFilterHelpers/areaType';
import { mockArea } from '@/mock/data/mockArea';

const mockArea1 = mockArea({ code: 'A1', name: 'Area1' });
const mockArea2 = mockArea({ code: 'A2', name: 'Area2' });

describe('healthDataRequestAreas', () => {
  it('returns only selected area codes if England is included', () => {
    const searchState = {
      [SearchParams.AreasSelected]: [areaCodeForEngland],
      [SearchParams.AreaTypeSelected]: 'LocalAuthority',
    };

    const result = healthDataRequestAreas(searchState, [mockArea1, mockArea2]);

    expect(result).toEqual([
      {
        areaCodes: [areaCodeForEngland],
        areaType: 'LocalAuthority',
      },
    ]);
  });

  it('adds England separately if not included in selected areas', () => {
    const searchState = {
      [SearchParams.AreasSelected]: ['A1'],
      [SearchParams.AreaTypeSelected]: 'LocalAuthority',
    };

    const result = healthDataRequestAreas(searchState, [mockArea1]);

    expect(result).toEqual([
      {
        areaCodes: ['A1'],
        areaType: 'LocalAuthority',
      },
      {
        areaCodes: [areaCodeForEngland],
        areaType: englandAreaType.key,
      },
    ]);
  });

  it('adds group code if different from England', () => {
    const searchState = {
      [SearchParams.AreasSelected]: ['A1'],
      [SearchParams.AreaTypeSelected]: 'LocalAuthority',
      [SearchParams.GroupSelected]: 'GROUP1',
      [SearchParams.GroupTypeSelected]: 'ICB',
    };

    const result = healthDataRequestAreas(searchState, [mockArea1]);

    expect(result).toEqual([
      {
        areaCodes: ['A1'],
        areaType: 'LocalAuthority',
      },
      {
        areaCodes: [areaCodeForEngland],
        areaType: englandAreaType.key,
      },
      {
        areaCodes: ['GROUP1'],
        areaType: 'ICB',
      },
    ]);
  });

  it('does not add group code if it is the same as England', () => {
    const searchState = {
      [SearchParams.AreasSelected]: ['A1'],
      [SearchParams.AreaTypeSelected]: 'LocalAuthority',
      [SearchParams.GroupSelected]: areaCodeForEngland,
      [SearchParams.GroupTypeSelected]: 'ICB',
    };

    const result = healthDataRequestAreas(searchState, [mockArea1]);

    expect(result).toEqual([
      {
        areaCodes: ['A1'],
        areaType: 'LocalAuthority',
      },
      {
        areaCodes: [areaCodeForEngland],
        areaType: englandAreaType.key,
      },
    ]);
  });

  it('handles empty areasSelected gracefully', () => {
    const searchState = {
      [SearchParams.AreaTypeSelected]: 'Region',
    };

    const result = healthDataRequestAreas(searchState);

    expect(result).toEqual([
      {
        areaCodes: ['E92000001'],
        areaType: 'Region',
      },
    ]);
  });
});
