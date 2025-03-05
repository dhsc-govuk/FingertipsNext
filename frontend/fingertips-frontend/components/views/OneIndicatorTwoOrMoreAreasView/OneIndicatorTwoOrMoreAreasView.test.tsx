/**
 * @jest-environment node
 */

import { IndicatorsApi } from '@/generated-sources/ft-api-client';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { mockDeep } from 'jest-mock-extended';
import OneIndicatorTwoOrMoreAreasView from '.';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';

const mockIndicatorsApi = mockDeep<IndicatorsApi>();
// ApiClientFactory.getIndicatorsApiClient = () => mockIndicatorsApi;

describe('OneIndicatorTwoOrMoreAreasView', () => {
  it.each([
    [
      ['1', '2'],
      ['A001', 'A002'],
    ],
    [['1'], ['A001']],
  ])(
    'should return an error if given invalid parameters',
    async (testIndicators, testAreas) => {
      const searchState: SearchStateParams = {
        [SearchParams.IndicatorsSelected]: testIndicators,
        [SearchParams.AreasSelected]: testAreas,
      };
      mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce([]);
      await expect(async () => {
        await OneIndicatorTwoOrMoreAreasView({ searchState: searchState });
      }).rejects.toThrow('Invalid parameters provided to view');
    }
  );

  it.each([
    [
      ['1'],
      ['A001', 'A002'],
      'G001',
      ['A001', 'A002', areaCodeForEngland, 'G001'],
    ],
    //   [['1'], ['A001'], areaCodeForEngland, ['A001', areaCodeForEngland]],
    //   [['1'], [areaCodeForEngland], undefined, [areaCodeForEngland]],
  ])(
    'should make 1 call to the healthIndicatorApi with the expected parameters',
    async (testIndicators, testAreas, testGroup, expectedAreaCodes) => {
      const searchState: SearchStateParams = {
        [SearchParams.IndicatorsSelected]: testIndicators,
        [SearchParams.AreasSelected]: testAreas,
        [SearchParams.GroupSelected]: testGroup,
      };
      mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce([]);

      await OneIndicatorTwoOrMoreAreasView({ searchState: searchState });

      expect(
        mockIndicatorsApi.getHealthDataForAnIndicator
      ).toHaveBeenNthCalledWith(1, {
        areaCodes: expectedAreaCodes,
        indicatorId: 1,
      });
    }
  );
});
