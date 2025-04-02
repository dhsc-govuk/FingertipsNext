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

const mockIndicatorDocument = (indicatorId: string): IndicatorDocument => {
  return {
    indicatorID: indicatorId,
    indicatorName: 'mock indicator',
    indicatorDefinition: 'mock description',
    dataSource: '1',
    earliestDataPeriod: '1',
    latestDataPeriod: '1',
    lastUpdatedDate: new Date(),
    hasInequalities: false,
    unitLabel: '1',
  };
};

const fullSearchParams: SearchStateParams = {
  [SearchParams.IndicatorsSelected]: ['1', '2'],
  [SearchParams.AreasSelected]: ['A001'],
  [SearchParams.GroupSelected]: 'G001',
};

const fullSelectedIndicatorsData: IndicatorDocument[] = [
  mockIndicatorDocument('id 1'),
  mockIndicatorDocument('id 2'),
];

describe('TwoOrMoreIndicatorsAreasView', () => {
  beforeEach(() => {
    mockIndicatorsApi.getHealthDataForAnIndicator
      .mockResolvedValueOnce(mockIndicator)
      .mockResolvedValueOnce(mockIndicator);
  });

  it('should call TwoOrMoreIndicatorsAreasViewPlots with the correct props', async () => {
    const page = await TwoOrMoreIndicatorsAreasView({
      searchState: fullSearchParams,
      selectedIndicatorsData: fullSelectedIndicatorsData,
    });

    expect(page.props.searchState).toEqual(fullSearchParams);
    expect(page.props.indicatorData).toEqual([mockIndicator, mockIndicator]);
    expect(page.props.indicatorMetadata).toEqual(fullSelectedIndicatorsData);
  });

  it('should throw an error when search state contains no selected indicators', async () => {
    const searchState: SearchStateParams = {
      ...fullSearchParams,
      [SearchParams.IndicatorsSelected]: [],
    };

    await expect(async () => {
      await TwoOrMoreIndicatorsAreasView({
        searchState: searchState,
        selectedIndicatorsData: fullSelectedIndicatorsData,
      });
    }).rejects.toThrow('indicators');
  });

  it('should throw an error when search state contains fewer than 2 selected indicators', async () => {
    const searchState: SearchStateParams = {
      ...fullSearchParams,
      [SearchParams.IndicatorsSelected]: ['1'],
    };

    await expect(async () => {
      await TwoOrMoreIndicatorsAreasView({
        searchState: searchState,
        selectedIndicatorsData: fullSelectedIndicatorsData,
      });
    }).rejects.toThrow('indicators');
  });

  it('should throw an error when search state contains no selected areas', async () => {
    const searchState: SearchStateParams = {
      ...fullSearchParams,
      [SearchParams.AreasSelected]: [],
    };

    await expect(async () => {
      await TwoOrMoreIndicatorsAreasView({
        searchState: searchState,
        selectedIndicatorsData: fullSelectedIndicatorsData,
      });
    }).rejects.toThrow('areas');
  });

  it('should throw an error when indicator metadata is empty', async () => {
    const selectedIndicatorsData: IndicatorDocument[] = [];

    await expect(async () => {
      await TwoOrMoreIndicatorsAreasView({
        searchState: fullSearchParams,
        selectedIndicatorsData: selectedIndicatorsData,
      });
    }).rejects.toThrow('indicator metadata');
  });

  it('should throw an error when indicator metadata mismatches selected indicators', async () => {
    const selectedIndicatorsData: IndicatorDocument[] = [];
    fullSearchParams[SearchParams.IndicatorsSelected]?.forEach(
      (indicatorId) => {
        selectedIndicatorsData.push(mockIndicatorDocument(indicatorId));
      }
    );
    selectedIndicatorsData.push(mockIndicatorDocument('99999'));

    await expect(async () => {
      await TwoOrMoreIndicatorsAreasView({
        searchState: fullSearchParams,
        selectedIndicatorsData: selectedIndicatorsData,
      });
    }).rejects.toThrow('indicator metadata');
  });
});
