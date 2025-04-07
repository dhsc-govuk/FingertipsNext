/**
 * @jest-environment node
 */
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import {
  HealthDataForArea,
  IndicatorsApi,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import { mockDeep } from 'jest-mock-extended';
import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';
import TwoOrMoreIndicatorsEnglandView from '@/components/views/TwoOrMoreIndicatorsEnglandView/index';

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

const mockIndicatorDocument = (indicatorId: string, dataSource: string, earliestDataPeriod: string, latestDataPeriod: string, unitLabel: string): IndicatorDocument => {
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

describe('TwoOrMoreIndicatorsEnglandView', () => {
  it('should throw an error when the area code is not england', async () => {
    const searchState: SearchStateParams = {
      [SearchParams.AreasSelected]: ['12345'],
      [SearchParams.IndicatorsSelected]: ['1', '2'],
    };

    await expect(async () => {
      await TwoOrMoreIndicatorsEnglandView({
        searchState: searchState,
        selectedIndicatorsData: fullSelectedIndicatorsData,
      });
    }).rejects.toThrow('error getting health indicator data for areas');
  });

  describe('TwoOrMoreIndicatorsEnglandView when the area code is england', () => {
    beforeEach(() => {
      mockIndicatorsApi.getHealthDataForAnIndicator
        .mockResolvedValueOnce(mockIndicator)
        .mockResolvedValueOnce(mockIndicator);
    });

    it('should call TwoOrMoreIndicatorsEnglandViewPlots with the correct props', async () => {
      const page = await TwoOrMoreIndicatorsEnglandView({
        searchState: mockSearchParams,
        selectedIndicatorsData: fullSelectedIndicatorsData,
      });

      expect(page.props.children.props.searchState).toEqual(mockSearchParams);
      expect(page.props.children.props.indicatorData).toEqual([
        mockIndicator,
        mockIndicator,
      ]);
      expect(page.props.children.props.indicatorMetadata).toEqual(
        fullSelectedIndicatorsData
      );
    });

    it('should throw an error when search state contains no selected indicators', async () => {
      const searchState: SearchStateParams = {
        ...mockSearchParams,
        [SearchParams.IndicatorsSelected]: [],
      };

      await expect(async () => {
        await TwoOrMoreIndicatorsEnglandView({
          searchState: searchState,
          selectedIndicatorsData: fullSelectedIndicatorsData,
        });
      }).rejects.toThrow('Invalid parameters provided to view');
    });

    it('should throw an error when search state contains fewer than 2 selected indicators', async () => {
      const searchState: SearchStateParams = {
        ...mockSearchParams,
        [SearchParams.IndicatorsSelected]: ['1'],
      };

      await expect(async () => {
        await TwoOrMoreIndicatorsEnglandView({
          searchState: searchState,
          selectedIndicatorsData: fullSelectedIndicatorsData,
        });
      }).rejects.toThrow('Invalid parameters provided to view');
    });
  });
});
