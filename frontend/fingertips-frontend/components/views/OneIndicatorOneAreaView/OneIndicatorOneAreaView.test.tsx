/**
 * @jest-environment node
 */

import { IndicatorsApi } from '@/generated-sources/ft-api-client';
import { mockDeep } from 'jest-mock-extended';
import OneIndicatorOneAreaView from '.';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';
import { mockHealthData } from '@/mock/data/healthdata';

const mockIndicatorsApi = mockDeep<IndicatorsApi>();
ApiClientFactory.getIndicatorsApiClient = () => mockIndicatorsApi;

describe('OneIndicatorOneAreaView', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  it.each([
    [['1'], ['A001', 'A002']],
    [['1', '2'], ['A001']],
  ])(
    'should return an error if given invalid parameters',
    (testIndicators, testAreas) => {
      const searchState: SearchStateParams = {
        [SearchParams.IndicatorsSelected]: testIndicators,
        [SearchParams.AreasSelected]: testAreas,
      };
      mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce([]);
      expect(async () => {
        await OneIndicatorOneAreaView({ searchState: searchState });
      }).rejects.toThrow('Invalid parameters provided to view');
    }
  );

  it('should make 1 call to the healthIndicatorApi with the expected parameters', async () => {
    const searchState: SearchStateParams = {
      [SearchParams.IndicatorsSelected]: ['1'],
      [SearchParams.AreasSelected]: ['A001'],
    };
    mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce([]);

    await OneIndicatorOneAreaView({ searchState: searchState });

    expect(
      mockIndicatorsApi.getHealthDataForAnIndicator
    ).toHaveBeenNthCalledWith(1, {
      areaCodes: ['A001', areaCodeForEngland],
      indicatorId: 1,
    });
  });

  it('should call OneIndicatorOneAreaViewPlots with the correct props', async () => {
    const searchState: SearchStateParams = {
      [SearchParams.IndicatorsSelected]: ['108'],
      [SearchParams.AreasSelected]: ['E12000001'],
    };
    mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce([
      mockHealthData['108'][1],
    ]);

    const page = await OneIndicatorOneAreaView({ searchState: searchState });

    expect(page.props.healthIndicatorData).toEqual([mockHealthData['108'][1]]);
    expect(page.props.searchState).toEqual(searchState);
  });
});
