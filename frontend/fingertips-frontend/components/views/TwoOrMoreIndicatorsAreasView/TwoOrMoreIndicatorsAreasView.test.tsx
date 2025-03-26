/**
 * @jest-environment node
 */

import { IndicatorsApi } from '@/generated-sources/ft-api-client';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { mockDeep } from 'jest-mock-extended';
import TwoOrMoreIndicatorsAreasView from '.';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';
import { SearchServiceFactory } from '@/lib/search/searchServiceFactory';
import { IIndicatorSearchService } from '@/lib/search/searchTypes';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';

const mockIndicatorsApi = mockDeep<IndicatorsApi>();
ApiClientFactory.getIndicatorsApiClient = () => mockIndicatorsApi;

const mockIndicatorSearchService = mockDeep<IIndicatorSearchService>();
SearchServiceFactory.getIndicatorSearchService = () =>
  mockIndicatorSearchService;

const mockAreaCode = 'A001';
const mockGroupCode = 'G001';

const mockAreaData: HealthDataForArea = {
  areaCode: mockAreaCode,
  areaName: 'area',
  healthData: [],
};

const mockGroupData: HealthDataForArea = {
  areaCode: mockGroupCode,
  areaName: 'group',
  healthData: [],
};

const mockEnglandData: HealthDataForArea = {
  areaCode: areaCodeForEngland,
  areaName: 'england',
  healthData: [],
};

describe('TwoOrMoreIndicatorsAreasView', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should call TwoOrMoreIndicatorsAreasViewPlots with the correct props', async () => {
    const searchState: SearchStateParams = {
      [SearchParams.IndicatorsSelected]: ['1', '2'],
      [SearchParams.AreasSelected]: ['A001'],
      [SearchParams.GroupSelected]: 'G001',
    };

    mockIndicatorsApi.getHealthDataForAnIndicator
      .mockResolvedValueOnce([mockAreaData, mockGroupData, mockEnglandData])
      .mockResolvedValueOnce([mockAreaData, mockGroupData, mockEnglandData]);

    const page = await TwoOrMoreIndicatorsAreasView({
      searchState: searchState,
    });

    expect(page.props.searchState).toEqual(searchState);
    //expect(page.props.healthIndicatorData).toEqual(mockResponses);
  });
});
