import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { OneIndicatorOneAreaViewPlots } from '.';
import { mockHealthData } from '@/mock/data/healthdata';
import { render, screen } from '@testing-library/react';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';

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
  associatedAreaCodes: ['E06000047'],
  unitLabel: 'pancakes',
  hasInequalities: true,
  usedInPoc: true,
};

const mockSearch = 'test';
const mockIndicator = ['108'];
const mockAreas = ['A001'];

const searchState: SearchStateParams = {
  [SearchParams.SearchedIndicator]: mockSearch,
  [SearchParams.IndicatorsSelected]: mockIndicator,
  [SearchParams.AreasSelected]: mockAreas,
};

const testHealthData: HealthDataForArea[] = [mockHealthData['108'][1]];

describe('OneIndicatorOneAreaViewPlots', () => {
  it('should render back link with correct search parameters', () => {
    render(
      <OneIndicatorOneAreaViewPlots
        healthIndicatorData={testHealthData}
        searchState={searchState}
      />
    );

    const backLink = screen.getByRole('link', { name: /back/i });
    const expectedUrl = `/results?${SearchParams.SearchedIndicator}=${mockSearch}&${SearchParams.IndicatorsSelected}=${mockIndicator}&${SearchParams.AreasSelected}=${mockAreas[0]}`;

    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute('data-testid', 'chart-page-back-link');
    expect(backLink).toHaveAttribute('href', expectedUrl);
  });

  it('should render the view with correct title', () => {
    render(
      <OneIndicatorOneAreaViewPlots
        healthIndicatorData={[mockHealthData['108'][1]]}
        searchState={searchState}
        indicatorMetadata={mockMetaData}
      />
    );

    const heading = screen.getByRole('heading', { level: 2 });

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
        healthIndicatorData={testHealthData}
        searchState={searchState}
        indicatorMetadata={mockMetaData}
      />
    );
    expect(
      screen.getByRole('heading', {
        name: 'See how the indicator has changed over time',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('tabContainer-lineChartAndTable')
    ).toBeInTheDocument();
    expect(
      await screen.findByTestId('lineChart-component')
    ).toBeInTheDocument();
    expect(screen.getByTestId('lineChartTable-component')).toBeInTheDocument();
  });

  it('should display data source when metadata exists', () => {
    render(
      <OneIndicatorOneAreaViewPlots
        healthIndicatorData={testHealthData}
        searchState={searchState}
        indicatorMetadata={mockMetaData}
      />
    );

    expect(
      screen.getAllByText('Data source:', { exact: false })[0]
    ).toBeVisible();
  });

  it('should not display line chart and line chart table when there are less than 2 time periods per area selected', () => {
    const MOCK_DATA = [
      {
        areaCode: 'A1',
        areaName: 'Area 1',
        healthData: [mockHealthData['1'][0].healthData[0]],
      },
    ];

    render(
      <OneIndicatorOneAreaViewPlots
        healthIndicatorData={MOCK_DATA}
        searchState={searchState}
        indicatorMetadata={mockMetaData}
      />
    );

    expect(
      screen.queryByRole('heading', {
        name: 'See how the indicator has changed over time',
      })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('tabContainer-lineChartAndTable')
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId('lineChart-component')).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('lineChartTable-component')
    ).not.toBeInTheDocument();
  });
});
