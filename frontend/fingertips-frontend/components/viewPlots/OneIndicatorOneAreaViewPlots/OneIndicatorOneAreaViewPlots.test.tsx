import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { OneIndicatorOneAreaViewPlots } from '.';
import { mockHealthData } from '@/mock/data/healthdata';
import { render, screen, waitFor } from '@testing-library/react';
import { IndicatorWithHealthDataForArea } from '@/generated-sources/ft-api-client';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';

jest.mock('next/navigation', () => {
  const originalModule = jest.requireActual('next/navigation');

  return {
    ...originalModule,
    useRouter: jest.fn().mockImplementation(() => ({})),
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

const searchState: SearchStateParams = {
  [SearchParams.SearchedIndicator]: mockSearch,
  [SearchParams.IndicatorsSelected]: mockIndicator,
  [SearchParams.AreasSelected]: mockAreas,
};

const testHealthData: IndicatorWithHealthDataForArea = {
  areaHealthData: [mockHealthData['108'][1]],
};

describe('OneIndicatorOneAreaViewPlots', () => {
  it('should render the view with correct title', async () => {
    render(
      <OneIndicatorOneAreaViewPlots
        indicatorData={{ areaHealthData: [mockHealthData['108'][1]] }}
        searchState={searchState}
        indicatorMetadata={mockMetaData}
      />
    );

    const heading = await screen.findByRole('heading', { level: 2 });

    expect(
      screen.getByTestId('oneIndicatorOneAreaViewPlot-component')
    ).toBeInTheDocument();
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(
      'View data for selected indicators and areas'
    );
  });

  it('should render the LineChart components', async () => {
    render(
      <OneIndicatorOneAreaViewPlots
        indicatorData={testHealthData}
        searchState={searchState}
        indicatorMetadata={mockMetaData}
      />
    );
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

  it('should render the LineChart components in the special case that England is the only area', async () => {
    const mockSearch = 'test';
    const mockIndicator = ['108'];
    const mockAreas = [areaCodeForEngland];

    const searchState: SearchStateParams = {
      [SearchParams.SearchedIndicator]: mockSearch,
      [SearchParams.IndicatorsSelected]: mockIndicator,
      [SearchParams.AreasSelected]: mockAreas,
    };

    render(
      <OneIndicatorOneAreaViewPlots
        indicatorData={{ areaHealthData: [mockHealthData['108'][0]] }}
        searchState={searchState}
        indicatorMetadata={mockMetaData}
      />
    );

    const highcharts = await screen.findAllByTestId(
      'highcharts-react-component-lineChart'
    );
    await waitFor(() => {
      expect(highcharts).toHaveLength(2);
    });

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
    render(
      <OneIndicatorOneAreaViewPlots
        indicatorData={testHealthData}
        searchState={searchState}
        indicatorMetadata={mockMetaData}
      />
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

    render(
      <OneIndicatorOneAreaViewPlots
        indicatorData={MOCK_DATA}
        searchState={searchState}
        indicatorMetadata={mockMetaData}
      />
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
    render(
      <OneIndicatorOneAreaViewPlots
        indicatorData={testHealthData}
        searchState={searchState}
        indicatorMetadata={mockMetaData}
      />
    );

    expect(
      await screen.findByTestId('inequalities-component')
    ).toBeInTheDocument();
  });
});
