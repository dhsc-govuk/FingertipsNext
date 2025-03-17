import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { Inequalities } from '.';
import { MOCK_HEALTH_DATA } from '@/lib/tableHelpers/mocks';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';

const state: SearchStateParams = {
  [SearchParams.SearchedIndicator]: 'testing',
  [SearchParams.IndicatorsSelected]: ['333'],
  [SearchParams.AreasSelected]: ['A1245'],
  [SearchParams.ConfidenceIntervalSelected]: ['lineChart'],
};

describe('Inequalities suite', () => {
  it('should render inequalities component', () => {
    render(
      <Inequalities
        healthIndicatorData={MOCK_HEALTH_DATA[1]}
        searchState={state}
      />
    );

    expect(screen.getByTestId('inequalities-component')).toBeInTheDocument();
    expect(
      screen.getByTestId('inequalitiesLineChartTable-component')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('inequalitiesLineChart-component')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('inequalitiesBarChartTable-component')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('inequalitiesBarChart-component')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('tabContainer-inequalitiesLineChartAndTable')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('tabContainer-inequalitiesBarChartAndTable')
    ).toBeInTheDocument();
  });

  it('should render expected text', () => {
    render(
      <Inequalities
        healthIndicatorData={MOCK_HEALTH_DATA[1]}
        searchState={state}
      />
    );

    expect(screen.getAllByRole('heading', { level: 4 })[0]).toHaveTextContent(
      'Inequalities data in a single time period'
    );
    expect(screen.getAllByRole('heading', { level: 4 })[1]).toHaveTextContent(
      'Inequalities data over time'
    );
  });

  it('check if the measurement unit value "kg" is rendered correctly', () => {
    render(
      <Inequalities
        healthIndicatorData={MOCK_HEALTH_DATA[1]}
        searchState={state}
        measurementUnit="kg"
      />
    );
    expect(screen.getByText('kg')).toBeInTheDocument();
  });
});
