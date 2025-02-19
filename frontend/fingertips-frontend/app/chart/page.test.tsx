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
import { AreasApi, IndicatorsApi } from '@/generated-sources/ft-api-client';
import { mockAreaDataForCountiesAndUAs } from '@/mock/data/areaData';

const mockIndicatorsApi = mockDeep<IndicatorsApi>();
const mockAreasApi = mockDeep<AreasApi>();

ApiClientFactory.getIndicatorsApiClient = () => mockIndicatorsApi;
ApiClientFactory.getAreasApiClient = () => mockAreasApi;

jest.mock('@/components/pages/chart');

jest.mock('@/components/organisms/LineChart/', () => {
  return {
    LineChart: function LineChart() {
      return <div data-testid="lineChart-component"></div>;
    },
  };
});

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

  describe('when no parent area is available ', () => {
    it('should make 2 calls for get health data, when theres only one indicator selected - first one for the indicator the next one for the population data', async () => {
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
      });
      expect(
        mockIndicatorsApi.getHealthDataForAnIndicator
      ).toHaveBeenNthCalledWith(2, {
        areaCodes: ['A001', areaCodeForEngland],
        indicatorId: 2,
      });
      expect(
        mockIndicatorsApi.getHealthDataForAnIndicator
      ).toHaveBeenNthCalledWith(3, {
        areaCodes: ['A001', areaCodeForEngland],
        indicatorId: indicatorIdForPopulation,
      });
    });

    it('should pass the correct props to the Chart page', async () => {
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

      expect(page.props.healthIndicatorData).toEqual([mockHealthData['1']]);
      expect(page.props.populationData).toEqual(expectedPopulationData);
      expect(page.props.searchedIndicator).toEqual('testing');
      expect(page.props.indicatorsSelected).toEqual(['1']);
    });
  });

  describe('when a single parent area is available ', () => {
    it('should make 1 call for get area data when there is one area selected', async () => {
      const mockAreaCode = 'E06000047';
      const searchParams: SearchStateParams = {
        [SearchParams.SearchedIndicator]: 'testing',
        [SearchParams.IndicatorsSelected]: ['333'],
        [SearchParams.AreasSelected]: [mockAreaCode],
      };
      mockAreasApi.getArea.mockResolvedValueOnce(
        mockAreaDataForCountiesAndUAs[mockAreaCode]
      );

      await ChartPage({
        searchParams: generateSearchParams(searchParams),
      });
      expect(mockAreasApi.getArea).toHaveBeenNthCalledWith(1, {
        areaCode: mockAreaCode,
      });
    });

    it('should make 2 calls for get health data, when theres only one indicator selected - first one for the indicator, including the parent area the next one for the population data', async () => {
      const mockAreaCode = 'E06000047';
      const searchParams: SearchStateParams = {
        [SearchParams.SearchedIndicator]: 'testing',
        [SearchParams.IndicatorsSelected]: ['333'],
        [SearchParams.AreasSelected]: [mockAreaCode],
      };
      mockAreasApi.getArea.mockResolvedValueOnce(
        mockAreaDataForCountiesAndUAs[mockAreaCode]
      );
      mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce([]);
      mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce([]);

      await ChartPage({
        searchParams: generateSearchParams(searchParams),
      });

      expect(
        mockIndicatorsApi.getHealthDataForAnIndicator
      ).toHaveBeenNthCalledWith(1, {
        areaCodes: [mockAreaCode, areaCodeForEngland, 'E12000001'],
        indicatorId: 333,
      });
      expect(
        mockIndicatorsApi.getHealthDataForAnIndicator
      ).toHaveBeenNthCalledWith(2, {
        areaCodes: [mockAreaCode, areaCodeForEngland],
        indicatorId: indicatorIdForPopulation,
      });
    });

    it('should pass the correct props to the Chart page', async () => {
      const mockAreaCode = 'E06000047';
      const searchParams: SearchStateParams = {
        [SearchParams.SearchedIndicator]: 'testing',
        [SearchParams.IndicatorsSelected]: ['333'],
        [SearchParams.AreasSelected]: [mockAreaCode],
      };
      mockAreasApi.getArea.mockResolvedValueOnce(
        mockAreaDataForCountiesAndUAs[mockAreaCode]
      );

      mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce(
        mockHealthData['333']
      );

      const page = await ChartPage({
        searchParams: generateSearchParams(searchParams),
      });

      expect(page.props.healthIndicatorData).toEqual([mockHealthData['333']]);
      expect(page.props.searchedIndicator).toEqual('testing');
      expect(page.props.indicatorsSelected).toEqual(['333']);
      expect(page.props.parentAreaCode).toEqual('E12000001');
    });
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

    expect(page.props.healthIndicatorData).toEqual([mockHealthData['1']]);
    expect(page.props.populationData).toEqual(undefined);
    expect(page.props.searchedIndicator).toEqual('testing');
    expect(page.props.indicatorsSelected).toEqual(['1']);
  });
});
