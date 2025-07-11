// MUST BE AT THE TOP DUE TO HOISTING OF MOCKED MODULES
import { mockUsePathname } from '@/mock/utils/mockNextNavigation';
import { mockSetIsLoading } from '@/mock/utils/mockUseLoadingState';
//
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { OneIndicatorOneAreaViewPlots } from '.';
import { act, render, screen, waitFor, within } from '@testing-library/react';
import { IndicatorWithHealthDataForArea } from '@/generated-sources/ft-api-client';
import { QueryClientProvider } from '@tanstack/react-query';
import { QueryClient } from '@tanstack/query-core';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { mockIndicatorDocument } from '@/mock/data/mockIndicatorDocument';
import { mockIndicatorWithHealthDataForArea } from '@/mock/data/mockIndicatorWithHealthDataForArea';
import { oneIndicatorRequestParams } from '@/components/charts/helpers/oneIndicatorRequestParams';
import {
  EndPoints,
  queryKeyFromRequestParams,
} from '@/components/charts/helpers/queryKeyFromRequestParams';
import {
  mockHealthDataForArea,
  mockHealthDataForArea_England,
} from '@/mock/data/mockHealthDataForArea';
import { mockHealthDataPoints } from '@/mock/data/mockHealthDataPoint';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { mockIndicatorSegment } from '@/mock/data/mockIndicatorSegment';
import { SessionProvider } from 'next-auth/react';

mockUsePathname.mockReturnValue('some-mock-path');
mockSetIsLoading.mockReturnValue(false);

const testMetaData = mockIndicatorDocument();
const testHealthData = mockIndicatorWithHealthDataForArea({
  areaHealthData: [
    mockHealthDataForArea({
      healthData: [],
      indicatorSegments: [
        mockIndicatorSegment({
          healthData: mockHealthDataPoints([{ year: 2023 }, { year: 2022 }]),
        }),
      ],
    }),
  ],
});

const mockSearch = 'test';
const mockAreas = [testHealthData.name as string];
const mockSearchState = {
  [SearchParams.SearchedIndicator]: mockSearch,
  [SearchParams.IndicatorsSelected]: [testMetaData.indicatorID],
  [SearchParams.AreasSelected]: mockAreas,
};
const mockUseSearchStateParams = vi.fn();
vi.mock('@/components/hooks/useSearchStateParams', () => ({
  useSearchStateParams: () => mockUseSearchStateParams(),
}));

const testRender = async (
  searchState: SearchStateParams,
  healthData: IndicatorWithHealthDataForArea,
  indicatorMetadata: IndicatorDocument
) => {
  mockUseSearchStateParams.mockReturnValue(searchState);
  const client = new QueryClient();
  const lineChartApiParams = oneIndicatorRequestParams(searchState, []);
  const lineChartQueryKey = queryKeyFromRequestParams(
    EndPoints.HealthDataForAnIndicator,
    lineChartApiParams
  );
  client.setQueryData([lineChartQueryKey], healthData);
  client.setQueryData(
    [`/indicator/${indicatorMetadata.indicatorID}`],
    indicatorMetadata
  );

  // DHSCFT-1039: can this be replaced with custom hook?
  await act(() =>
    render(
      <SessionProvider>
        <QueryClientProvider client={client}>
          <OneIndicatorOneAreaViewPlots indicatorData={healthData} />
        </QueryClientProvider>
      </SessionProvider>
    )
  );
};

describe('OneIndicatorOneAreaViewPlots', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the benchmark select area drop down for the view', async () => {
    await testRender(mockSearchState, testHealthData, testMetaData);

    const benchmarkAreaDropDown = screen.getByRole('combobox', {
      name: 'Select a benchmark',
    });
    const benchmarkAreaDropDownOptions = within(
      benchmarkAreaDropDown
    ).getAllByRole('option');

    expect(benchmarkAreaDropDown).toBeInTheDocument();
    expect(benchmarkAreaDropDownOptions).toHaveLength(1);
    benchmarkAreaDropDownOptions.forEach((option) => {
      expect(option.textContent).toBe('England');
    });
  });

  it('should render the LineChart components', async () => {
    await testRender(mockSearchState, testHealthData, testMetaData);

    expect(
      screen.getByRole('heading', {
        name: 'Indicator data over time',
      })
    ).toBeInTheDocument();

    expect(
      screen.getByTestId('tabContainer-lineChartAndTable')
    ).toBeInTheDocument();

    expect(
      await screen.findByTestId('standardLineChart-component')
    ).toBeInTheDocument();

    expect(screen.getByTestId('segmentation-options')).toBeInTheDocument();
    expect(screen.getByTestId('lineChartTable-component')).toBeInTheDocument();
  });

  it('should render the LineChart components in the special case that England is the only area', async () => {
    const mockSearchStateOnlyEngland = {
      [SearchParams.IndicatorsSelected]: [testMetaData.indicatorID],
      [SearchParams.AreaTypeSelected]: 'england',
      [SearchParams.AreasSelected]: [areaCodeForEngland],
    };
    const testHealthDataOnlyEngland = mockIndicatorWithHealthDataForArea({
      areaHealthData: [
        mockHealthDataForArea_England({
          healthData: [],
          indicatorSegments: [
            mockIndicatorSegment({
              healthData: mockHealthDataPoints([
                { year: 2023 },
                { year: 2022 },
              ]),
            }),
          ],
        }),
      ],
    });
    await testRender(
      mockSearchStateOnlyEngland,
      testHealthDataOnlyEngland,
      testMetaData
    );

    const highcharts = await screen.findAllByTestId(
      'highcharts-react-component-lineChart'
    );
    expect(highcharts[0]).toHaveTextContent('England');
    expect(highcharts[0]).not.toHaveTextContent('Benchmark');
    expect(
      screen.getByRole('heading', {
        name: 'Indicator data over time',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('tabContainer-lineChartAndTable')
    ).toBeInTheDocument();
    expect(
      await screen.findByTestId('standardLineChart-component')
    ).toBeInTheDocument();
    expect(screen.getByTestId('lineChartTable-component')).toBeInTheDocument();
  });

  it('should display data source when metadata exists', async () => {
    await testRender(mockSearchState, testHealthData, testMetaData);

    const actual = await screen.findAllByText(
      `Data source: ${testMetaData.dataSource}`,
      { exact: true }
    );

    expect(actual[0]).toBeVisible();
  });

  it('should not display line chart and line chart table when there are less than 2 time periods per area selected', async () => {
    await testRender(
      mockSearchState,
      mockIndicatorWithHealthDataForArea(),
      testMetaData
    );

    expect(
      await waitFor(() =>
        screen.queryByRole('heading', {
          name: 'Indicator data over time',
        })
      )
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('tabContainer-lineChartAndTable')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('standardLineChart-component')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('lineChartTable-component')
    ).not.toBeInTheDocument();
  });

  it('should render the inequalities component', async () => {
    await testRender(mockSearchState, testHealthData, testMetaData);

    expect(
      await screen.findByTestId('inequalities-component')
    ).toBeInTheDocument();
  });
});
