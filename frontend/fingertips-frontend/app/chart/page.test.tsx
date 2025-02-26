/**
 * @jest-environment node
 */

import {
  areaCodeForEngland,
  indicatorIdForPopulation,
} from '@/lib/chartHelpers/constants';
import ChartPage from './page';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { mockHealthData } from '@/mock/data/healthdata';
import { preparePopulationData } from '@/lib/chartHelpers/preparePopulationData';
import { mockDeep } from 'jest-mock-extended';
import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';
import { IndicatorsApi } from '@/generated-sources/ft-api-client';
import { getMapData } from '@/lib/thematicMapUtils/getMapData';
import NHSRegionsMap from '@/assets/maps/NHS_England_Regions_January_2024_EN_BSC_7500404208533377417.geo.json';

const mockIndicatorsApi = mockDeep<IndicatorsApi>();

ApiClientFactory.getIndicatorsApiClient = () => mockIndicatorsApi;

jest.mock('@/components/pages/chart');
jest.mock('@/lib/thematicMapUtils/getMapData', () => ({
  getMapData: jest.fn(),
}));

const searchParams: SearchStateParams = {
  [SearchParams.SearchedIndicator]: 'testing',
  [SearchParams.IndicatorsSelected]: ['1'],
  [SearchParams.AreasSelected]: ['A001'],
};

async function generateSearchParams(value: SearchStateParams) {
  return value;
}

describe('Chart Page', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when no group area is available', () => {
    it('should make 2 calls for get health data, when there iss only one indicator selected - first one for the indicator the next one for the population data', async () => {
      mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce([]);
      mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce([]);

      await ChartPage({
        searchParams: generateSearchParams(searchParams),
      });

      expect(
        mockIndicatorsApi.getHealthDataForAnIndicator
      ).toHaveBeenNthCalledWith(1, {
        areaCodes: ['A001', areaCodeForEngland],
        indicatorId: 1,
        inequalities: ['sex'],
      });
      expect(
        mockIndicatorsApi.getHealthDataForAnIndicator
      ).toHaveBeenNthCalledWith(2, {
        areaCodes: ['A001', areaCodeForEngland],
        indicatorId: indicatorIdForPopulation,
      });
    });

    it('should make 3 calls for get health data, when there are 2 indicators selected - first two for the indicators the last one for the population data', async () => {
      const searchParams: SearchStateParams = {
        [SearchParams.SearchedIndicator]: 'testing',
        [SearchParams.IndicatorsSelected]: ['1', '2'],
        [SearchParams.AreasSelected]: ['A001'],
      };

      mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce([]);
      mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce([]);
      mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce([]);

      await ChartPage({
        searchParams: generateSearchParams(searchParams),
      });

      expect(
        mockIndicatorsApi.getHealthDataForAnIndicator
      ).toHaveBeenNthCalledWith(1, {
        areaCodes: ['A001', areaCodeForEngland],
        indicatorId: 1,
        inequalities: [],
      });
      expect(
        mockIndicatorsApi.getHealthDataForAnIndicator
      ).toHaveBeenNthCalledWith(2, {
        areaCodes: ['A001', areaCodeForEngland],
        indicatorId: 2,
        inequalities: [],
      });
      expect(
        mockIndicatorsApi.getHealthDataForAnIndicator
      ).toHaveBeenNthCalledWith(3, {
        areaCodes: ['A001', areaCodeForEngland],
        indicatorId: indicatorIdForPopulation,
      });
    });
  });

  describe('when a single group is selected', () => {
    const mockAreaCode = 'E06000047';
    it('should make 2 calls for get health data, when there is only one indicator selected - first one for the indicator, including the group area the next one for the population data', async () => {
      const mockParentAreaCode = 'E12000001';
      const searchParams: SearchStateParams = {
        [SearchParams.SearchedIndicator]: 'testing',
        [SearchParams.IndicatorsSelected]: ['333'],
        [SearchParams.AreasSelected]: [mockAreaCode],
        [SearchParams.GroupSelected]: mockParentAreaCode,
      };

      mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce([]);
      mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce([]);

      await ChartPage({
        searchParams: generateSearchParams(searchParams),
      });

      expect(
        mockIndicatorsApi.getHealthDataForAnIndicator
      ).toHaveBeenNthCalledWith(1, {
        areaCodes: [mockAreaCode, areaCodeForEngland, mockParentAreaCode],
        indicatorId: 333,
        inequalities: ['sex'],
      });
      expect(
        mockIndicatorsApi.getHealthDataForAnIndicator
      ).toHaveBeenNthCalledWith(2, {
        areaCodes: [mockAreaCode, areaCodeForEngland],
        indicatorId: indicatorIdForPopulation,
      });
    });

    it('should not include groupSelected in the API call if England is the groupSelected', async () => {
      const mockParentAreaCode = 'E92000001';
      const searchParams: SearchStateParams = {
        [SearchParams.SearchedIndicator]: 'testing',
        [SearchParams.IndicatorsSelected]: ['333'],
        [SearchParams.AreasSelected]: [mockAreaCode],
        [SearchParams.GroupSelected]: mockParentAreaCode,
      };

      mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce([]);
      mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce([]);

      await ChartPage({
        searchParams: generateSearchParams(searchParams),
      });

      expect(
        mockIndicatorsApi.getHealthDataForAnIndicator
      ).toHaveBeenNthCalledWith(1, {
        areaCodes: [mockAreaCode, areaCodeForEngland],
        indicatorId: 333,
        inequalities: ['sex'],
      });
      expect(
        mockIndicatorsApi.getHealthDataForAnIndicator
      ).toHaveBeenNthCalledWith(2, {
        areaCodes: [mockAreaCode, areaCodeForEngland],
        indicatorId: indicatorIdForPopulation,
      });
    });

    describe('Check correct props are passed to Chart page component', () => {
      it('should pass healthIndicatorData to the Chart page', async () => {
        mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce(
          mockHealthData['1']
        );

        const page = await ChartPage({
          searchParams: generateSearchParams(searchParams),
        });

        expect(page.props.healthIndicatorData).toEqual([mockHealthData['1']]);
      });

      it('should pass population data to the Chart page', async () => {
        const expectedPopulationData = preparePopulationData(
          mockHealthData[`${indicatorIdForPopulation}`],
          'A001'
        );

        mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce(
          mockHealthData['1']
        );
        mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce(
          mockHealthData[`${indicatorIdForPopulation}`]
        );

        const page = await ChartPage({
          searchParams: generateSearchParams(searchParams),
        });

        expect(page.props.populationData).toEqual(expectedPopulationData);
      });

      it('should pass undefined if there was an error getting population data', async () => {
        mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce(
          mockHealthData['1']
        );
        mockIndicatorsApi.getHealthDataForAnIndicator.mockRejectedValueOnce(
          'Some error getting population data'
        );

        const page = await ChartPage({
          searchParams: generateSearchParams(searchParams),
        });

        expect(page.props.populationData).toEqual(undefined);
      });

      it('should pass search state prop with data from the params to the Chart page', async () => {
        const mockAreaCode = 'E06000047';
        const searchParams: SearchStateParams = {
          [SearchParams.SearchedIndicator]: 'testing',
          [SearchParams.IndicatorsSelected]: ['333'],
          [SearchParams.AreasSelected]: [mockAreaCode],
        };

        mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce(
          mockHealthData['333']
        );

        const page = await ChartPage({
          searchParams: generateSearchParams(searchParams),
        });

        expect(page.props.searchState).toEqual({
          [SearchParams.SearchedIndicator]: 'testing',
          [SearchParams.IndicatorsSelected]: ['333'],
          [SearchParams.AreasSelected]: ['E06000047'],
        });
      });

      it('should pass map data to the Chart page', async () => {
        const searchParams: SearchStateParams = {
          [SearchParams.SearchedIndicator]: 'testing',
          [SearchParams.IndicatorsSelected]: ['333'],
          [SearchParams.AreasSelected]: ['E40000011', 'E40000012'],
          [SearchParams.AreaTypeSelected]: 'nhs-regions',
        };

        mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce(
          mockHealthData['333']
        );

        const mockData = (getMapData as jest.Mock).mockReturnValue({
          mapJoinKey: 'test',
          mapFile: NHSRegionsMap,
          mapGroupBoundary: NHSRegionsMap,
        });

        const page = await ChartPage({
          searchParams: generateSearchParams(searchParams),
        });

        const expected = getMapData('nhs-regions', ['A1245', 'A1245']);

        expect(mockData).toHaveBeenCalled();
        expect(page.props.mapData).toEqual(expected);
      });

      it('should pass undefined if there are not enough areas selected ', async () => {
        const mockAreaCode = 'E06000047';
        const searchParams: SearchStateParams = {
          [SearchParams.SearchedIndicator]: 'testing',
          [SearchParams.IndicatorsSelected]: ['333'],
          [SearchParams.AreasSelected]: [mockAreaCode],
          [SearchParams.AreaTypeSelected]: 'nhs-regions',
        };

        mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce(
          mockHealthData['333']
        );

        const page = await ChartPage({
          searchParams: generateSearchParams(searchParams),
        });

        expect(page.props.mapData).toEqual(undefined);
      });
    });
  });
});
