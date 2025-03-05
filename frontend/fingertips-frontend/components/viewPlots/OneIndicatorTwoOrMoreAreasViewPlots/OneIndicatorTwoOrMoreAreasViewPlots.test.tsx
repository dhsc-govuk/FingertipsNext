import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { OneIndicatorTwoOrMoreAreasViewPlots } from '.';
import { render, screen } from '@testing-library/react';
import { mockHealthData } from '@/mock/data/healthdata';

describe('OneIndicatorTwoOrMoreAreasViewPlots', () => {
  it('should render the view with correct title', () => {
    const searchState: SearchStateParams = {
      [SearchParams.IndicatorsSelected]: ['108'],
      [SearchParams.AreasSelected]: ['E12000001'],
    };
    render(
      <OneIndicatorTwoOrMoreAreasViewPlots
        healthIndicatorData={[mockHealthData['108'][1]]}
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
});
