import { render, screen } from '@testing-library/react';
import { LineChart } from '@/components/organisms/LineChart/index';
import { expect } from '@jest/globals';
import { mockHealthData } from '@/mock/data/healthdata';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';

const mockPath = 'some-mock-path';
const mockReplace = jest.fn();

jest.mock('next/navigation', () => {
  const originalModule = jest.requireActual('next/navigation');

  return {
    ...originalModule,
    usePathname: () => mockPath,
    useRouter: jest.fn().mockImplementation(() => ({
      replace: mockReplace,
    })),
  };
});

const state: SearchStateParams = {
  [SearchParams.SearchedIndicator]: 'testing',
  [SearchParams.IndicatorsSelected]: ['333'],
  [SearchParams.AreasSelected]: ['A1245'],
  [SearchParams.ConfidenceIntervalSelected]: ['lineChart'],
};

it('should render the Highcharts react component with passed parameters within the LineChart component', async () => {
  const xAxisPropsTitle = 'DifferentXTitle';
  const yAxisPropsTitle = 'DifferentYTitle';

  render(
    <LineChart
      healthIndicatorData={mockHealthData[1]}
      xAxisTitle={xAxisPropsTitle}
      yAxisTitle={yAxisPropsTitle}
      accessibilityLabel="Accessibility label"
      searchState={state}
      measurementUnit="%"
    />
  );

  const highcharts = await screen.findByTestId(
    'highcharts-react-component-lineChart'
  );

  expect(highcharts).toBeInTheDocument();
  expect(highcharts).toHaveTextContent(xAxisPropsTitle);
});

it('should validate the checkbox is checked when passed the correct parameter of lineChart', async () => {
  render(
    <LineChart
      healthIndicatorData={mockHealthData[1]}
      accessibilityLabel="Accessibility label"
      searchState={state}
      measurementUnit="%"
    />
  );

  expect(await screen.findByRole('checkbox')).toBeChecked();
});

it('should validate the checkbox is not checked when passed an incorrect parameter of randomChart', async () => {
  const state: SearchStateParams = {
    [SearchParams.SearchedIndicator]: 'testing',
    [SearchParams.IndicatorsSelected]: ['333'],
    [SearchParams.AreasSelected]: ['A1245'],
    [SearchParams.ConfidenceIntervalSelected]: ['randomChart'],
  };

  render(
    <LineChart
      healthIndicatorData={mockHealthData[1]}
      accessibilityLabel="Accessibility label"
      searchState={state}
      measurementUnit="%"
    />
  );

  expect(await screen.findByRole('checkbox')).not.toBeChecked();
});
