// MUST BE AT THE TOP DUE TO HOISTING OF MOCKED MODULES
import { mockUseSearchStateParams } from '@/mock/utils/mockUseSearchStateParams';
//
import { screen, within } from '@testing-library/react';
import { testRenderQueryClient } from '@/mock/utils/testRenderQueryClient';
import { MultipleIndicatorBasicTable } from '@/components/charts/BasicTable/MultipleIndicatorBasicTable';
import { SearchParams } from '@/lib/searchStateManager';
import { mockIndicatorWithHealthDataForArea } from '@/mock/data/mockIndicatorWithHealthDataForArea';
import { mockHealthDataForArea_England } from '@/mock/data/mockHealthDataForArea';
import { mockIndicatorSegment } from '@/mock/data/mockIndicatorSegment';
import { mockSexData } from '@/mock/data/mockSexData';
import {
  EndPoints,
  queryKeyFromRequestParams,
} from '@/components/charts/helpers/queryKeyFromRequestParams';
import { SeedData } from '@/components/atoms/SeedQueryCache/seedQueryCache.types';
import { mockIndicatorDocument } from '@/mock/data/mockIndicatorDocument';
import { multipleIndicatorRequestParams } from '@/components/charts/helpers/multipleIndicatorRequestParams';
import {
  chartTitleConfig,
  ChartTitleKeysEnum,
} from '@/lib/ChartTitles/chartTitleEnums';

const seedData: SeedData = {};

const testSearch = {
  [SearchParams.IndicatorsSelected]: ['41101', '22401'],
  [SearchParams.AreaTypeSelected]: 'england',
};

// mock the indicator meta data
const indicator41101 = mockIndicatorDocument({
  indicatorID: '41101',
  indicatorName: 'foo',
});
const indicator22401 = mockIndicatorDocument({
  indicatorID: '22401',
  indicatorName: 'bar',
});
seedData['/indicator/41101'] = indicator41101;
seedData['/indicator/22401'] = indicator22401;

// mock the health data
const reqParams = multipleIndicatorRequestParams(testSearch);
const queryKeys = reqParams.map((params) =>
  queryKeyFromRequestParams(EndPoints.HealthDataForAnIndicator, params)
);

seedData[queryKeys[0]] = mockIndicatorWithHealthDataForArea({
  indicatorId: 41101,
  name: 'foo',
  areaHealthData: [
    mockHealthDataForArea_England({
      indicatorSegments: [
        mockIndicatorSegment({ sex: mockSexData({ value: 'Female' }) }),
        mockIndicatorSegment({ sex: mockSexData({ value: 'Persons' }) }),
        mockIndicatorSegment({ sex: mockSexData({ value: 'Male' }) }),
      ],
    }),
  ],
});

seedData[queryKeys[1]] = mockIndicatorWithHealthDataForArea({
  indicatorId: 22401,
  name: 'bar',
  areaHealthData: [
    mockHealthDataForArea_England({
      indicatorSegments: [
        mockIndicatorSegment({ sex: mockSexData({ value: 'Female' }) }),
        mockIndicatorSegment({ sex: mockSexData({ value: 'Persons' }) }),
        mockIndicatorSegment({ sex: mockSexData({ value: 'Male' }) }),
      ],
    }),
  ],
});

describe('MultipleIndicatorBasicTable', () => {
  it('renders MultipleIndicatorBasicTable correctly', async () => {
    mockUseSearchStateParams.mockReturnValue(testSearch);

    await testRenderQueryClient(<MultipleIndicatorBasicTable />, seedData);

    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toHaveTextContent('Indicator segmentations overview');

    const tableComponent = screen.getByTestId('basic-table-component');
    expect(tableComponent).toBeInTheDocument();

    const subHeading = screen.getByRole('heading', { level: 4 });
    expect(subHeading).toHaveTextContent(
      chartTitleConfig[ChartTitleKeysEnum.BasicTableChart].subTitle ?? ''
    );

    const rows = within(tableComponent).getAllByRole('row');
    const firstCells = rows.map((row) => row.firstChild);
    const firstCellsText = firstCells.map((cell) => cell?.textContent);
    expect(firstCellsText).toEqual([
      'England',
      'Indicator',
      'bar (Persons, All ages, Yearly)',
      'bar (Male, All ages, Yearly)',
      'bar (Female, All ages, Yearly)',
      'foo (Persons, All ages, Yearly)',
      'foo (Male, All ages, Yearly)',
      'foo (Female, All ages, Yearly)',
    ]);
  });

  it('returns null when there is no data', async () => {
    mockUseSearchStateParams.mockReturnValue({});

    const { htmlContainer } = await testRenderQueryClient(
      <MultipleIndicatorBasicTable />,
      seedData
    );
    expect(htmlContainer?.firstChild).toBeNull();
  });
});
