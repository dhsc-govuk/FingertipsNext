/**
 * @vitest-environment node
 */

import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import HomePage from './page';
import { getAreaFilterData } from '@/lib/areaFilterHelpers/getAreaFilterData';
import {
  allAreaTypes,
  nhsRegionsAreaType,
  englandAreaType,
} from '@/lib/areaFilterHelpers/areaType';
import {
  mockAvailableAreas,
  mockAreaDataForNHSRegion,
} from '@/mock/data/areaData';
import {
  eastEnglandNHSRegion,
  londonNHSRegion,
} from '@/mock/data/areas/nhsRegionsAreas';
import { getSelectedAreasDataByAreaType } from '@/lib/areaFilterHelpers/getSelectedAreasData';
import { MockedFunction } from 'vitest';

vi.mock('@/lib/areaFilterHelpers/getAreaFilterData');
vi.mock('@/lib/areaFilterHelpers/getSelectedAreasData');
vi.mock('@/components/pages/home');

const mockGetAreaFilterData = getAreaFilterData as MockedFunction<
  typeof getAreaFilterData
>;

const mockGetSelectedAreasDataByAreaType =
  getSelectedAreasDataByAreaType as MockedFunction<
    typeof getSelectedAreasDataByAreaType
  >;
mockGetSelectedAreasDataByAreaType.mockResolvedValue([]);

async function generateSearchParams(value: SearchStateParams) {
  return value;
}

describe('Home page', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Check correct props are passed to the Home Page component', () => {
    it('should pass initialFormState prop based upon the searchParams provided', async () => {
      const searchState: SearchStateParams = {
        [SearchParams.SearchedIndicator]: 'testing',
        [SearchParams.AreasSelected]: ['E40000007'],
      };

      mockGetAreaFilterData.mockResolvedValue({
        updatedSearchState: searchState,
      });

      const page = await HomePage({
        searchParams: generateSearchParams(searchState),
      });

      expect(page.props.initialFormState).toEqual({
        indicator: 'testing',
        searchState: JSON.stringify(searchState),
        message: null,
        errors: {},
      });
    });

    it('should pass areaFilterData prop with the data from the getAreaFilterData call', async () => {
      const areaFilterData = {
        availableAreaTypes: allAreaTypes,
        availableGroupTypes: [nhsRegionsAreaType, englandAreaType],
        availableGroups: mockAvailableAreas['nhs-integrated-care-boards'],
        availableAreas:
          mockAreaDataForNHSRegion[eastEnglandNHSRegion.code].children,
      };

      mockGetAreaFilterData.mockResolvedValue(areaFilterData);

      const page = await HomePage({
        searchParams: generateSearchParams({}),
      });

      expect(mockGetAreaFilterData).toHaveBeenCalledWith({}, []);
      expect(page.props.areaFilterData).toEqual(areaFilterData);
    });

    it('should pass the selectedAreasData prop with data from getSelectedAreasDataByAreaType', async () => {
      mockGetSelectedAreasDataByAreaType.mockResolvedValue([
        eastEnglandNHSRegion,
        londonNHSRegion,
      ]);

      const searchState: SearchStateParams = {
        [SearchParams.AreaTypeSelected]: 'nhs-regions',
        [SearchParams.AreasSelected]: ['E40000007', 'E40000003'],
      };

      const page = await HomePage({
        searchParams: generateSearchParams(searchState),
      });

      expect(mockGetSelectedAreasDataByAreaType).toHaveBeenCalledWith(
        ['E40000007', 'E40000003'],
        'nhs-regions'
      );
      expect(page.props.selectedAreasData).toEqual([
        eastEnglandNHSRegion,
        londonNHSRegion,
      ]);
    });
  });
});
