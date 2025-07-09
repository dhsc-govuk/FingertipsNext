import { mockUseSearchStateParams } from '@/mock/utils/mockUseSearchStateParams';
import { mockHighChartsWrapperSetup } from '@/mock/utils/mockHighChartsWrapper';
//
import { screen } from '@testing-library/react';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';
import regionsMap from '@/components/charts/ThematicMap/regions.json';
import { testRenderQueryClient } from '@/mock/utils/testRenderQueryClient';
import { ThematicMapWrapper } from '@/components/charts/ThematicMap/ThematicMapWrapper';
import { SeedData } from '@/components/atoms/SeedQueryCache/seedQueryCache.types';
import { Area } from '@/generated-sources/ft-api-client';
import { mockAreas } from '@/mock/data/mockArea';
import { mockIndicatorDocument } from '@/mock/data/mockIndicatorDocument';
import { oneIndicatorRequestParams } from '@/components/charts/helpers/oneIndicatorRequestParams';
import {
  EndPoints,
  queryKeyFromRequestParams,
} from '@/components/charts/helpers/queryKeyFromRequestParams';
import { mockIndicatorWithHealthDataForArea } from '@/mock/data/mockIndicatorWithHealthDataForArea';
import {
  mockHealthDataForArea,
  mockHealthDataForArea_England,
} from '@/mock/data/mockHealthDataForArea';

mockHighChartsWrapperSetup();

const mockSearchState: SearchStateParams = {
  [SearchParams.IndicatorsSelected]: ['41101'],
  [SearchParams.GroupAreaSelected]: ALL_AREAS_SELECTED,
  [SearchParams.AreaTypeSelected]: 'regions',
};

const availableAreas: Area[] = mockAreas([
  { code: 'E12000001' },
  { code: 'E12000002' },
  { code: 'E12000003' },
]);

const mockHealthData = mockIndicatorWithHealthDataForArea({
  areaHealthData: [
    mockHealthDataForArea({ areaCode: 'E12000001' }),
    mockHealthDataForArea({ areaCode: 'E12000002' }),
    mockHealthDataForArea({ areaCode: 'E12000003' }),
    mockHealthDataForArea_England(),
  ],
});

const seedData: SeedData = {
  'map-geo-json/regions': regionsMap,
  availableAreas,
  '/indicator/41101': mockIndicatorDocument(),
};

const queryParams = oneIndicatorRequestParams(mockSearchState, availableAreas);
const queryKey = queryKeyFromRequestParams(
  EndPoints.HealthDataForAnIndicator,
  queryParams
);

seedData[queryKey] = mockHealthData;

describe('ThematicMapWrapper', () => {
  it('should render the map component', async () => {
    mockUseSearchStateParams.mockReturnValue(mockSearchState);

    await testRenderQueryClient(<ThematicMapWrapper />, seedData);

    expect(screen.getByTestId('thematicMap-component')).toBeInTheDocument();
  });

  it('should return null when useCompareAreasTableData returns null', async () => {
    mockUseSearchStateParams.mockReturnValue({
      ...mockSearchState,
      [SearchParams.IndicatorsSelected]: ['404'],
    });

    const { htmlContainer } = await testRenderQueryClient(
      <ThematicMapWrapper />,
      seedData
    );

    expect(htmlContainer?.firstChild).toBeNull();
  });
});
