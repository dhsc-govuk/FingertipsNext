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
};
it('should render the Highcharts react component with passed parameters within the LineChart component', async () => {
  const xAxisPropsTitle = 'DifferentXTitle';
  render(
    <LineChart
      healthIndicatorData={mockHealthData[1]}
      xAxisTitle={`${xAxisPropsTitle}`}
      accessibilityLabel="Accessibility label"
      searchState={state}
    />
  );

  const highcharts = await screen.findByTestId(
    'highcharts-react-component-lineChart'
  );

  expect(highcharts).toBeInTheDocument();
  expect(highcharts).toHaveTextContent(xAxisPropsTitle);
});
