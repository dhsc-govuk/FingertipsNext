import { mockUseSearchStateParams } from '@/mock/utils/mockUseSearchStateParams';
//
import { testRenderQueryClient } from '@/mock/utils/testRenderQueryClient';
import { PopulationPyramidWrapper } from '@/components/charts/PopulationPyramid/PopulationPyramidWrapper';
import { SeedData } from '@/components/atoms/SeedQueryCache/seedQueryCache.types';
import { SearchParams } from '@/lib/searchStateManager';
import { mockIndicatorWithHealthDataForArea } from '@/mock/data/mockIndicatorWithHealthDataForArea';
import { populationPyramidRequestParams } from '@/components/charts/PopulationPyramid/helpers/populationPyramidRequestParams';
import {
  EndPoints,
  queryKeyFromRequestParams,
} from '@/components/charts/helpers/queryKeyFromRequestParams';
import { screen } from '@testing-library/react';

const testSearch = {
  [SearchParams.AreasSelected]: ['a'],
  [SearchParams.GroupSelected]: 'g1',
  [SearchParams.AreaTypeSelected]: 'regions',
};

const testHealthData = mockIndicatorWithHealthDataForArea();
const queryParams = populationPyramidRequestParams(testSearch, []);
const queryKey = queryKeyFromRequestParams(
  EndPoints.HealthDataForAnIndicator,
  queryParams
);

const seedData: SeedData = {
  [queryKey]: testHealthData,
  availableAreas: [],
};

mockUseSearchStateParams.mockReturnValue(testSearch);

describe('PopulationPyramidWrapper', () => {
  it('should render nothing if healthData is not available', async () => {
    const { htmlContainer } = await testRenderQueryClient(
      <PopulationPyramidWrapper />,
      { availableAreas: [] }
    );

    expect(htmlContainer?.firstChild).toBeNull();
  });

  it('should render the population pyramid', async () => {
    await testRenderQueryClient(<PopulationPyramidWrapper />, seedData);

    expect(
      screen.getByTestId('populationPyramidWithTable-component')
    ).toBeInTheDocument();
  });
});
