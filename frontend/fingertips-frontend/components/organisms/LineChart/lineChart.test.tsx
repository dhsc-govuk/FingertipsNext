import { render, screen, waitFor } from '@testing-library/react';
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
};

it('should render the Highcharts react component with passed parameters within the LineChart component', async () => {
  const xAxisPropsTitle = 'DifferentXTitle';
  const yAxisPropsTitle = 'DifferentYTitle';

  const measurementUnit = '%';
  render(
    <LineChart
      healthIndicatorData={mockHealthData[1]}
      xAxisTitle={xAxisPropsTitle}
      yAxisTitle={yAxisPropsTitle}
      accessibilityLabel="Accessibility label"
      searchState={state}
      measurementUnit={measurementUnit}
    />
  );

  const highcharts = await screen.findByTestId(
    'highcharts-react-component-lineChart'
  );

  await waitFor(() => {
    expect(highcharts).toBeInTheDocument();
  });

  expect(highcharts).toHaveTextContent(xAxisPropsTitle);
  expect(highcharts).toHaveTextContent(yAxisPropsTitle);
});

it('should render the Highcharts react component with England as a series, not a benchmark when England is the only area', async () => {
  render(
    <LineChart
      healthIndicatorData={[mockHealthData[1][1]]}
      xAxisTitle={'XTitle'}
      yAxisTitle={'YTitle'}
      accessibilityLabel="Accessibility label"
      searchState={state}
      measurementUnit={'%'}
    />
  );

  const highcharts = await screen.findByTestId(
    'highcharts-react-component-lineChart'
  );

  await waitFor(() => {
    expect(highcharts).toBeInTheDocument();
  });

  expect(highcharts).toHaveTextContent('England');
  expect(highcharts).not.toHaveTextContent('Benchmark');
});
