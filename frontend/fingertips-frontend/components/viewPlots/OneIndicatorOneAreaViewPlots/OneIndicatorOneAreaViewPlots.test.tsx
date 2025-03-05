import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { OneIndicatorOneAreaViewPlots } from '.';
import { mockHealthData } from '@/mock/data/healthdata';
import { render, screen } from '@testing-library/react';

jest.mock('next/navigation', () => {
  const originalModule = jest.requireActual('next/navigation');

  return {
    ...originalModule,
    useRouter: jest.fn().mockImplementation(() => ({})),
  };
});

describe('OneIndicatorOneAreaViewPlots', () => {
  it('should render the view with the title with correct text', () => {
    const searchState: SearchStateParams = {
      [SearchParams.IndicatorsSelected]: ['108'],
      [SearchParams.AreasSelected]: ['E12000001'],
    };
    render(
      <OneIndicatorOneAreaViewPlots
        healthIndicatorData={[mockHealthData['108'][1]]}
        searchState={searchState}
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
    const searchState: SearchStateParams = {
      [SearchParams.IndicatorsSelected]: ['108'],
      [SearchParams.AreasSelected]: ['E12000001'],
    };
    render(
      <OneIndicatorOneAreaViewPlots
        healthIndicatorData={[mockHealthData['108'][1]]}
        searchState={searchState}
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

  it('should not display line chart and line chart table when there are less than 2 time periods per area selected', () => {
    const MOCK_DATA = [
      {
        areaCode: 'A1',
        areaName: 'Area 1',
        healthData: [mockHealthData['1'][0].healthData[0]],
      },
    ];

    const state: SearchStateParams = {
      [SearchParams.IndicatorsSelected]: ['0'],
      [SearchParams.AreasSelected]: ['A001'],
    };

    render(
      <OneIndicatorOneAreaViewPlots
        healthIndicatorData={MOCK_DATA}
        searchState={state}
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
