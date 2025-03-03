import { IndicatorsApi } from '@/generated-sources/ft-api-client';
import { mockDeep } from 'jest-mock-extended';
import OneIndicatorOneAreaView from '.';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { render } from '@testing-library/react';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';

const mockIndicatorsApi = mockDeep<IndicatorsApi>();

async function generateSearchParams(value: SearchStateParams) {
  return value;
}

const searchParams: SearchStateParams = {
  [SearchParams.SearchedIndicator]: 'testing',
  [SearchParams.IndicatorsSelected]: ['1'],
  [SearchParams.AreasSelected]: ['A001'],
};

describe('OneIndicatorOneAreaView', () => {
  it('should make 1 call to the healthIndicatorApi', async () => {
    mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce([]);
    mockIndicatorsApi.getHealthDataForAnIndicator.mockResolvedValueOnce([]);
    const searchState = await generateSearchParams(searchParams);

    await OneIndicatorOneAreaView({ searchState: searchState });

    // render(<OneIndicatorOneAreaView searchState={searchState} />);

    expect(
      mockIndicatorsApi.getHealthDataForAnIndicator
    ).toHaveBeenNthCalledWith(1, {
      areaCodes: ['A001', areaCodeForEngland],
      indicatorId: 1,
      inequalities: ['sex'],
    });
  });
});

// one call to the dashboard with correct props
