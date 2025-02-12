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

const mockIndicatorsApi = mockDeep<IndicatorsApi>();

ApiClientFactory.getIndicatorsApiClient = () => mockIndicatorsApi;

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
    const expectedPopulateData = preparePopulationData(
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

    expect(page.props.data).toEqual([mockHealthData['1']]);
    expect(page.props.populationData).toEqual(expectedPopulateData);
    expect(page.props.searchedIndicator).toEqual('testing');
    expect(page.props.indicatorsSelected).toEqual(['1']);
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

    expect(page.props.data).toEqual([mockHealthData['1']]);
    expect(page.props.populationData).toEqual(undefined);
    expect(page.props.searchedIndicator).toEqual('testing');
    expect(page.props.indicatorsSelected).toEqual(['1']);
  });
});
