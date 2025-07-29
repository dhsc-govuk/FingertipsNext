/**
 * @vitest-environment node
 */
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import {
  HealthDataForArea,
  IndicatorsApi,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import { mockDeep } from 'vitest-mock-extended';
import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';
import { healthDataPoint } from '@/lib/mocks';
import TwoOrMoreIndicatorsAreasView from '@/components/views/TwoOrMoreIndicatorsAreasView/index';

const mockSearchParams: SearchStateParams = {
  [SearchParams.IndicatorsSelected]: ['1', '2'],
  [SearchParams.AreasSelected]: [areaCodeForEngland],
};

const mockEnglandData: HealthDataForArea = {
  areaCode: areaCodeForEngland,
  areaName: 'england',
  healthData: [],
};

const mockIndicator: IndicatorWithHealthDataForArea = {
  areaHealthData: [mockEnglandData],
};
const mockEnglandDataWithHealthData: HealthDataForArea = {
  areaCode: areaCodeForEngland,
  areaName: 'england',
  healthData: [healthDataPoint],
};

const mockIndicatorWithHealthData = {
  areaHealthData: [mockEnglandDataWithHealthData],
};

const mockIndicatorDocument = (
  indicatorId: string,
  dataSource: string,
  earliestDataPeriod: string,
  latestDataPeriod: string,
  unitLabel: string
): IndicatorDocument => {
  return {
    indicatorID: indicatorId,
    indicatorName: 'mock indicator',
    indicatorDefinition: 'mock description',
    dataSource: dataSource,
    earliestDataPeriod: earliestDataPeriod,
    latestDataPeriod: latestDataPeriod,
    lastUpdatedDate: new Date(),
    hasInequalities: false,
    unitLabel: unitLabel,
  };
};

const fullSelectedIndicatorsData: IndicatorDocument[] = [
  mockIndicatorDocument('id 1', '1', '1', '1', '1'),
  mockIndicatorDocument('id 2', '2', '2', '2', '2'),
];

const mockIndicatorsApi = mockDeep<IndicatorsApi>();
ApiClientFactory.getIndicatorsApiClient = () => mockIndicatorsApi;

describe('TwoOrMoreIndicatorsAreasView - England only', () => {
  describe('TwoOrMoreIndicatorsAreasView when the area code is england', () => {
    beforeEach(() => {
      mockIndicatorsApi.getHealthDataForAnIndicator
        .mockResolvedValueOnce(mockIndicator)
        .mockResolvedValueOnce(mockIndicatorWithHealthData);
    });

    it('should throw an error when search state contains no selected indicators', async () => {
      const searchState: SearchStateParams = {
        ...mockSearchParams,
        [SearchParams.IndicatorsSelected]: [],
      };

      await expect(async () => {
        await TwoOrMoreIndicatorsAreasView({
          searchState: searchState,
          selectedIndicatorsData: fullSelectedIndicatorsData,
        });
      }).rejects.toThrow('Invalid indicators selected passed to view');
    });

    it('should throw an error when search state contains fewer than 2 selected indicators', async () => {
      const searchState: SearchStateParams = {
        ...mockSearchParams,
        [SearchParams.IndicatorsSelected]: ['1'],
      };

      await expect(async () => {
        await TwoOrMoreIndicatorsAreasView({
          searchState: searchState,
          selectedIndicatorsData: fullSelectedIndicatorsData,
        });
      }).rejects.toThrow('Invalid indicators selected passed to view');
    });

    it('should throw an error when the incorrect metadata is passed', async () => {
      const selectedIndicatorsData: IndicatorDocument[] = [];
      mockSearchParams[SearchParams.IndicatorsSelected]?.forEach(
        (indicatorId) => {
          selectedIndicatorsData.push(
            mockIndicatorDocument(indicatorId, '1', '1', '1', '1')
          );
        }
      );
      selectedIndicatorsData.push(
        mockIndicatorDocument('5555', '5', '5', '5', '5')
      );

      await expect(async () => {
        await TwoOrMoreIndicatorsAreasView({
          searchState: mockSearchParams,
          selectedIndicatorsData: selectedIndicatorsData,
        });
      }).rejects.toThrow('Invalid indicator metadata passed to view');
    });
  });
});
