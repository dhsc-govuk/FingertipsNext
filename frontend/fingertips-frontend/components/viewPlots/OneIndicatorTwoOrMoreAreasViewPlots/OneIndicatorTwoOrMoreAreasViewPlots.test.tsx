import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { OneIndicatorTwoOrMoreAreasViewPlots } from '.';
import { render, screen } from '@testing-library/react';
import { mockHealthData } from '@/mock/data/healthdata';

jest.mock('next/navigation', () => {
  const originalModule = jest.requireActual('next/navigation');

  return {
    ...originalModule,
    useRouter: jest.fn().mockImplementation(() => ({})),
  };
});

describe('OneIndicatorTwoOrMoreAreasViewPlots', () => {
  it('should render the view with correct title', () => {
    const searchState: SearchStateParams = {
      [SearchParams.IndicatorsSelected]: ['1'],
      [SearchParams.AreasSelected]: ['A001'],
    };
    render(
      <OneIndicatorTwoOrMoreAreasViewPlots
        healthIndicatorData={mockHealthData['108']}
        searchState={searchState}
      />
    );

    const heading = screen.getByRole('heading', { level: 2 });

    expect(
      screen.getByTestId('oneIndicatorTwoOrMoreAreasViewPlots-component')
    ).toBeInTheDocument();
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(
      'View data for selected indicators and areas'
    );
  });

  it('should render the LineChart components when there are only 2 areas', async () => {
    const searchState: SearchStateParams = {
      [SearchParams.IndicatorsSelected]: ['1'],
      [SearchParams.AreasSelected]: ['A001', 'A002'],
    };
    render(
      <OneIndicatorTwoOrMoreAreasViewPlots
        healthIndicatorData={mockHealthData['108']}
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

  it('should not render the LineChart components when there are more than 2 areas', async () => {
    const searchState: SearchStateParams = {
      [SearchParams.IndicatorsSelected]: ['1'],
      [SearchParams.AreasSelected]: ['A001', 'A002', 'A003'],
    };
    render(
      <OneIndicatorTwoOrMoreAreasViewPlots
        healthIndicatorData={mockHealthData['108']}
        searchState={searchState}
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
  });
});
