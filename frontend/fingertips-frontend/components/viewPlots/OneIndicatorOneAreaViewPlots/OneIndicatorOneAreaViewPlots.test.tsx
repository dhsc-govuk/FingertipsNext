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
  beforeEach(() => {
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
  });
  it('should render the view title with correct text', () => {
    const heading = screen.getByRole('heading', { level: 2 });

    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(
      'View data for selected indicators and areas'
    );
  });

  it('should render the LineChart components', async () => {
    expect(
      screen.getByTestId('oneIndicatorOneAreaViewPlot-component')
    ).toBeInTheDocument();
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
    expect(
      screen.getByTestId('tabContainer-lineChartAndTable')
    ).toBeInTheDocument();
  });
});
