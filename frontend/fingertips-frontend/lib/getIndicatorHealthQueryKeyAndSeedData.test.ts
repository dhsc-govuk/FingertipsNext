import { IndicatorsApi } from '@/generated-sources/ft-api-client';
import { Session } from 'next-auth';
import { mockDeep } from 'vitest-mock-extended';
import { SearchParams, SearchStateParams } from './searchStateManager';
import { mockHealthData } from '@/mock/data/healthdata';
import { getIndicatorHealthQueryKeyAndSeedData } from './getIndicatorHealthQueryKeyAndSeedData';
import { EndPoints } from '@/components/charts/helpers/queryKeyFromRequestParams';

const indicatorApiMock = mockDeep<IndicatorsApi>();

describe('getIndicatorHealthDataSeed', async () => {
  beforeEach(() => vi.clearAllMocks());

  it('should call getHealthDataForAnIndicatorIncludingUnpublishedData when session is present', async () => {
    const session: Session | null = { expires: 'some timestamp' };
    const mockAreaCode = 'E06000047';
    const searchParams: SearchStateParams = {
      [SearchParams.SearchedIndicator]: 'testing',
      [SearchParams.IndicatorsSelected]: ['333'],
      [SearchParams.AreasSelected]: [mockAreaCode],
    };

    indicatorApiMock.getHealthDataForAnIndicatorIncludingUnpublishedData.mockResolvedValue(
      { ...mockHealthData }
    );

    const { healthData, queryKeySingleIndicator } =
      await getIndicatorHealthQueryKeyAndSeedData(
        indicatorApiMock,
        session,
        searchParams,
        []
      );

    expect(healthData).toEqual(mockHealthData);
    expect(
      queryKeySingleIndicator.includes(EndPoints.HealthDataForAnIndicator)
    ).toBe(true);
    expect(
      indicatorApiMock.getHealthDataForAnIndicatorIncludingUnpublishedData
    ).toHaveBeenCalled();
    expect(indicatorApiMock.getHealthDataForAnIndicator).not.toHaveBeenCalled();
  });

  it('should call getHealthDataForAnIndicator when session is not present', async () => {
    const mockAreaCode = 'E06000047';
    const searchParams: SearchStateParams = {
      [SearchParams.SearchedIndicator]: 'testing',
      [SearchParams.IndicatorsSelected]: ['333'],
      [SearchParams.AreasSelected]: [mockAreaCode],
    };

    indicatorApiMock.getHealthDataForAnIndicator.mockResolvedValue({
      ...mockHealthData,
    });

    const { healthData, queryKeySingleIndicator } =
      await getIndicatorHealthQueryKeyAndSeedData(
        indicatorApiMock,
        null,
        searchParams,
        []
      );

    expect(healthData).toEqual(mockHealthData);
    expect(
      queryKeySingleIndicator.includes(EndPoints.HealthDataForAnIndicator)
    ).toBe(true);
    expect(indicatorApiMock.getHealthDataForAnIndicator).toHaveBeenCalled();
    expect(
      indicatorApiMock.getHealthDataForAnIndicatorIncludingUnpublishedData
    ).not.toHaveBeenCalled();
  });
});
