// MUST BE AT THE TOP DUE TO HOISTING OF MOCKED MODULES
import { mockUsePathname } from '@/mock/utils/mockNextNavigation';
import { mockSetIsLoading } from '@/mock/utils/mockUseLoadingState';
import { mockUseSearchStateParams } from '@/mock/utils/mockUseSearchStateParams';
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
import { mockSexData } from '@/mock/data/mockSexData';
import { SessionProvider } from 'next-auth/react';
import {
  chartTitleConfig,
  ChartTitleKeysEnum,
} from '@/lib/ChartTitles/chartTitleEnums';

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
    mockHealthDataForArea({
      areaCode: areaCodeForEngland,
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
const mockAreas = testHealthData.areaHealthData?.map((area) => area.areaCode);
const mockSearchState = {
  [SearchParams.SearchedIndicator]: mockSearch,
  [SearchParams.IndicatorsSelected]: [testMetaData.indicatorID],
  [SearchParams.AreasSelected]: mockAreas,
};

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

  await act(() =>
    render(
      <SessionProvider session={null}>
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
      name: 'Select a benchmark for all charts',
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
        name: chartTitleConfig[ChartTitleKeysEnum.LineChart].title,
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
        name: chartTitleConfig[ChartTitleKeysEnum.LineChart].title,
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
          name: chartTitleConfig[ChartTitleKeysEnum.LineChart].title,
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

  it('should render the single indicator basic table component', async () => {
    const englandHealthData = mockIndicatorWithHealthDataForArea({
      areaHealthData: [
        mockHealthDataForArea({
          areaCode: areaCodeForEngland,
          healthData: [],
          indicatorSegments: [
            mockIndicatorSegment({
              healthData: mockHealthDataPoints([
                { year: 2023 },
                { year: 2022 },
              ]),
            }),
            mockIndicatorSegment({
              sex: mockSexData({ value: 'Male' }),
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
      {
        ...mockSearchState,
        [SearchParams.AreasSelected]: [areaCodeForEngland],
      },
      englandHealthData,
      testMetaData
    );

    expect(
      await screen.findByTestId('basic-table-component')
    ).toBeInTheDocument();

    expect(
      screen.getByRole('link', {
        name: chartTitleConfig[ChartTitleKeysEnum.BasicTableChart].title,
      })
    ).toHaveAttribute(
      'href',
      chartTitleConfig[ChartTitleKeysEnum.BasicTableChart].href
    );
  });

  it('should not render the single indicator basic table component when there is only one segment', async () => {
    await testRender(mockSearchState, testHealthData, testMetaData);

    expect(
      await screen.queryByTestId('basic-table-component')
    ).not.toBeInTheDocument();
  });

  describe('Render chart links', () => {
    it('should render line chart link when data is available', async () => {
      await testRender(mockSearchState, testHealthData, testMetaData);

      expect(
        screen.getByRole('link', {
          name: chartTitleConfig[ChartTitleKeysEnum.LineChart].title,
        })
      ).toBeInTheDocument();
    });

    it('should not render line chart link when no data is available', async () => {
      const mockNoHealthData = mockIndicatorWithHealthDataForArea({
        areaHealthData: [
          mockHealthDataForArea({
            healthData: [],
            indicatorSegments: [],
          }),
        ],
      });

      await testRender(mockSearchState, mockNoHealthData, testMetaData);

      expect(
        screen.queryByRole('link', {
          name: chartTitleConfig[ChartTitleKeysEnum.LineChart].title,
        })
      ).not.toBeInTheDocument();
    });

    it('should render population pyramid link', async () => {
      await testRender(mockSearchState, testHealthData, testMetaData);

      expect(
        screen.getByRole('link', {
          name: chartTitleConfig[ChartTitleKeysEnum.PopulationPyramid].title,
        })
      ).toBeInTheDocument();
    });
  });
});
