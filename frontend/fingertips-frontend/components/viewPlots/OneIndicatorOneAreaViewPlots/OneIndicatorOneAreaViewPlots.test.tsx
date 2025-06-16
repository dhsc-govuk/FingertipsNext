import { SearchParams } from '@/lib/searchStateManager';
import { OneIndicatorOneAreaViewPlots } from '.';
import { mockHealthData } from '@/mock/data/healthdata';
import { act, render, screen, waitFor, within } from '@testing-library/react';
import { IndicatorWithHealthDataForArea } from '@/generated-sources/ft-api-client';
import { LoaderContext } from '@/context/LoaderContext';

jest.mock('next/navigation', () => {
  const originalModule = jest.requireActual('next/navigation');

  return {
    ...originalModule,
    usePathname: () => 'some-mock-path',
    useRouter: jest.fn().mockImplementation(() => ({})),
  };
});

const mockLoaderContext: LoaderContext = {
  getIsLoading: jest.fn(),
  setIsLoading: jest.fn(),
};
jest.mock('@/context/LoaderContext', () => {
  return {
    useLoadingState: () => mockLoaderContext,
  };
});

const mockMetaData = {
  indicatorID: '108',
  indicatorName: 'pancakes eaten',
  indicatorDefinition: 'number of pancakes consumed',
  dataSource: 'BJSS Leeds',
  earliestDataPeriod: '2025',
  latestDataPeriod: '2025',
  lastUpdatedDate: new Date('March 4, 2025'),
  unitLabel: 'pancakes',
  hasInequalities: true,
};

const mockSearch = 'test';
const mockIndicator = ['108'];
const mockAreas = ['A001'];
jest.mock('@/components/hooks/useSearchStateParams', () => ({
  useSearchStateParams: () => ({
    [SearchParams.SearchedIndicator]: mockSearch,
    [SearchParams.IndicatorsSelected]: mockIndicator,
    [SearchParams.AreasSelected]: mockAreas,
  }),
}));

const testHealthData: IndicatorWithHealthDataForArea = {
  areaHealthData: [mockHealthData['108'][0], mockHealthData['108'][1]],
};

describe('OneIndicatorOneAreaViewPlots', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the benchmark select area drop down for the view', async () => {
    await act(() =>
      render(
        <OneIndicatorOneAreaViewPlots
          indicatorData={testHealthData}
          indicatorMetadata={mockMetaData}
        />
      )
    );

    await waitFor(async () => {
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
  });

  it('should render the LineChart components', async () => {
    await act(() =>
      render(
        <OneIndicatorOneAreaViewPlots
          indicatorData={testHealthData}
          indicatorMetadata={mockMetaData}
        />
      )
    );

    await waitFor(async () => {
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

      expect(
        screen.getByTestId('lineChartTable-component')
      ).toBeInTheDocument();
    });
  });

  it('should render the LineChart components in the special case that England is the only area', async () => {
    await act(() =>
      render(
        <OneIndicatorOneAreaViewPlots
          indicatorData={{ areaHealthData: [mockHealthData['108'][0]] }}
          indicatorMetadata={mockMetaData}
        />
      )
    );

    await waitFor(async () => {
      const highcharts = await screen.findAllByTestId(
        'highcharts-react-component-lineChart'
      );
      expect(highcharts).toHaveLength(2);
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
      expect(
        screen.getByTestId('lineChartTable-component')
      ).toBeInTheDocument();
    });
  });

  it('should display data source when metadata exists', async () => {
    await act(() =>
      render(
        <OneIndicatorOneAreaViewPlots
          indicatorData={testHealthData}
          indicatorMetadata={mockMetaData}
        />
      )
    );

    const actual = await screen.findAllByText('Data source:', { exact: false });

    expect(actual[0]).toBeVisible();
  });

  it('should not display line chart and line chart table when there are less than 2 time periods per area selected', async () => {
    const MOCK_DATA = {
      areaHealthData: [
        {
          areaCode: 'A1',
          areaName: 'Area 1',
          healthData: [mockHealthData['1'][0].healthData[0]],
        },
      ],
    };

    await act(() =>
      render(
        <OneIndicatorOneAreaViewPlots
          indicatorData={MOCK_DATA}
          indicatorMetadata={mockMetaData}
        />
      )
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
    await act(() =>
      render(
        <OneIndicatorOneAreaViewPlots
          indicatorData={testHealthData}
          indicatorMetadata={mockMetaData}
        />
      )
    );

    expect(
      await screen.findByTestId('inequalities-component')
    ).toBeInTheDocument();
  });
});
