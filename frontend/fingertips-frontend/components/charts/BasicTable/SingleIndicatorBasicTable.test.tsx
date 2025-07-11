import { mockUseSearchStateParams } from '@/mock/utils/mockUseSearchStateParams';
//
import { screen } from '@testing-library/react';
import { testRenderQueryClient } from '@/mock/utils/testRenderQueryClient';
import { SingleIndicatorBasicTable } from '@/components/charts/BasicTable/SingleIndicatorBasicTable';
import { SearchParams } from '@/lib/searchStateManager';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { mockIndicatorWithHealthDataForArea } from '@/mock/data/mockIndicatorWithHealthDataForArea';
import { mockHealthDataForArea } from '@/mock/data/mockHealthDataForArea';
import { mockIndicatorSegment } from '@/mock/data/mockIndicatorSegment';
import { mockSexData } from '@/mock/data/mockSexData';
import { oneIndicatorRequestParams } from '@/components/charts/helpers/oneIndicatorRequestParams';
import {
  EndPoints,
  queryKeyFromRequestParams,
} from '@/components/charts/helpers/queryKeyFromRequestParams';
import { SeedData } from '@/components/atoms/SeedQueryCache/seedQueryCache.types';
import { mockIndicatorDocument } from '@/mock/data/mockIndicatorDocument';

const testSearch = {
  [SearchParams.IndicatorsSelected]: ['41101'],
  [SearchParams.AreasSelected]: ['E06000015'],
  [SearchParams.AreaTypeSelected]: 'regions',
  [SearchParams.GroupTypeSelected]: 'england',
  [SearchParams.GroupSelected]: areaCodeForEngland,
};

const testHealthData = mockIndicatorWithHealthDataForArea({
  areaHealthData: [
    mockHealthDataForArea({
      indicatorSegments: [
        mockIndicatorSegment({ sex: mockSexData({ value: 'Female' }) }),
        mockIndicatorSegment({ sex: mockSexData({ value: 'Persons' }) }),
        mockIndicatorSegment({ sex: mockSexData({ value: 'Male' }) }),
      ],
    }),
  ],
});

const testParams = oneIndicatorRequestParams(testSearch, []);

const queryKey = queryKeyFromRequestParams(
  EndPoints.HealthDataForAnIndicator,
  testParams
);

const seedData: SeedData = {
  '/indicator/41101': mockIndicatorDocument(),
  [queryKey]: testHealthData,
};

describe('SingleIndicatorBasicTable', () => {
  it('renders SingleIndicatorBasicTable correctly', async () => {
    mockUseSearchStateParams.mockReturnValue(testSearch);

    await testRenderQueryClient(<SingleIndicatorBasicTable />, seedData);

    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toHaveTextContent('Indicator segmentations overview');

    const tableComponent = screen.getByTestId(
      'singleIndicatorBasicTable-component'
    );
    expect(tableComponent).toBeInTheDocument();

    const subHeading = screen.getByRole('heading', { level: 4 });
    expect(subHeading).toHaveTextContent(
      'Segmentation overview of selected indicator'
    );
  });

  it('returns null when there is no data', async () => {
    mockUseSearchStateParams.mockReturnValue({});

    const { htmlContainer } = await testRenderQueryClient(
      <SingleIndicatorBasicTable />,
      seedData
    );
    expect(htmlContainer?.firstChild).toBeNull();
  });
});
