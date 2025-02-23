import { render, screen } from '@testing-library/react';
import { LineChart } from '@/components/organisms/LineChart/index';
import { expect } from '@jest/globals';
import { mockHealthData } from '@/mock/data/healthdata';

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

it('should render the Highcharts react component with passed parameters within the LineChart component', () => {
  const xAxisPropsTitle = 'DifferentXTitle';
  render(
    <LineChart
      healthIndicatorData={mockHealthData[1]}
      xAxisTitle={`${xAxisPropsTitle}`}
      accessibilityLabel="Accessibility label"
    />
  );

  const highcharts = screen.getByTestId('highcharts-react-component-lineChart');

  expect(highcharts).toBeInTheDocument();
  expect(highcharts).toHaveTextContent(xAxisPropsTitle);
});
