/**
 * @jest-environment node
 */

import {
  HealthDataForArea,
  IndicatorsApi,
} from '@/generated-sources/ft-api-client';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { mockDeep } from 'jest-mock-extended';
import TwoOrMoreIndicatorsAreasView from '.';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { IndicatorWithHealthDataForArea } from '@/generated-sources/ft-api-client';

const mockIndicatorsApi = mockDeep<IndicatorsApi>();
ApiClientFactory.getIndicatorsApiClient = () => mockIndicatorsApi;

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

const mockIndicator: IndicatorWithHealthDataForArea = {
  areaHealthData: [mockAreaData, mockGroupData, mockEnglandData],
};

const mockIndicatorDocument = (indicatorId: string): IndicatorDocument => {
  return {
    indicatorID: indicatorId,
    indicatorName: 'mock indicator',
    indicatorDefinition: 'mock description',
    dataSource: '1',
    earliestDataPeriod: '1',
    latestDataPeriod: '1',
    lastUpdatedDate: new Date(),
    associatedAreaCodes: ['A001'],
    hasInequalities: false,
    unitLabel: '1',
    usedInPoc: false,
  };
};

describe('TwoOrMoreIndicatorsAreasView', () => {
  it('should call TwoOrMoreIndicatorsAreasViewPlots with the correct props', async () => {
    const searchState: SearchStateParams = {
      [SearchParams.IndicatorsSelected]: ['1', '2'],
      [SearchParams.AreasSelected]: ['A001'],
      [SearchParams.GroupSelected]: 'G001',
    };

    const selectedIndicatorsData: IndicatorDocument[] = [
      mockIndicatorDocument('id 1'),
      mockIndicatorDocument('id 2'),
    ];

    mockIndicatorsApi.getHealthDataForAnIndicator
      .mockResolvedValueOnce(mockIndicator)
      .mockResolvedValueOnce(mockIndicator);

    const page = await TwoOrMoreIndicatorsAreasView({
      searchState: searchState,
      selectedIndicatorsData: selectedIndicatorsData,
    });

    expect(page.props.searchState).toEqual(searchState);
    expect(page.props.indicatorData).toEqual([mockIndicator, mockIndicator]);
    expect(page.props.indicatorMetadata).toEqual(selectedIndicatorsData);
  });
});
