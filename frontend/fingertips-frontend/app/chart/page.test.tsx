/**
 * @jest-environment node
 */

import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import ChartPage from './page';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { mockHealthData } from '@/mock/data/healthdata';
import { preparePopulationData } from '@/lib/chartHelpers/preparePopulationData';

const mockGetHealthData = jest.fn();

jest.mock('@/lib/getApiConfiguration');
jest.mock('@/generated-sources/ft-api-client', () => {
  return {
    IndicatorsApi: jest.fn().mockImplementation(() => {
      return {
        getHealthDataForAnIndicator: mockGetHealthData,
      };
    }),
  };
});

jest.mock('@/components/pages/chart');

const searchParams: SearchStateParams = {
  [SearchParams.SearchedIndicator]: 'testing',
  [SearchParams.IndicatorsSelected]: ['1'],
  [SearchParams.AreasSelected]: ['A001'],
};

async function generateSearchParams(value: SearchStateParams) {
  return value;
}

describe('Chart Page', () => {
  it('should make 2 calls for get health data - first one for the indicator the next one for the population data', async () => {
    mockGetHealthData.mockResolvedValueOnce([]);
    mockGetHealthData.mockResolvedValueOnce([]);

    await ChartPage({
      searchParams: generateSearchParams(searchParams),
    });

    expect(mockGetHealthData).toHaveBeenNthCalledWith(1, {
      areaCodes: ['A001'],
      indicatorId: 1,
    });
    expect(mockGetHealthData).toHaveBeenNthCalledWith(2, {
      areaCodes: ['A001', areaCodeForEngland],
      indicatorId: 92708,
    });
  });

  it('should pass the correct props to the Chart page', async () => {
    const expectedPopulateData = preparePopulationData(
      mockHealthData['92708'],
      '1',
      '2'
    );

    mockGetHealthData.mockResolvedValueOnce(mockHealthData['1']);
    mockGetHealthData.mockResolvedValueOnce(mockHealthData['92708']);

    const page = await ChartPage({
      searchParams: generateSearchParams(searchParams),
    });

    expect(page.props.data).toEqual(mockHealthData['1']);
    expect(page.props.populationData).toEqual(expectedPopulateData);
    expect(page.props.searchedIndicator).toEqual('testing');
    expect(page.props.indicatorsSelected).toEqual(['1']);
  });

  it('should pass undefined if there was an error getting population data', async () => {
    mockGetHealthData.mockResolvedValueOnce(mockHealthData['1']);
    mockGetHealthData.mockRejectedValueOnce(
      'Some error getting population data'
    );

    const page = await ChartPage({
      searchParams: generateSearchParams(searchParams),
    });

    expect(page.props.data).toEqual(mockHealthData['1']);
    expect(page.props.populationData).toEqual(undefined);
    expect(page.props.searchedIndicator).toEqual('testing');
    expect(page.props.indicatorsSelected).toEqual(['1']);
  });
});
