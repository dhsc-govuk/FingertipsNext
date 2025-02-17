import { render, screen } from '@testing-library/react';
import { LineChart } from '@/components/organisms/LineChart/index';
import { expect } from '@jest/globals';
import { mockHealthData } from '@/mock/data/healthdata';
import { userEvent } from '@testing-library/user-event';

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

it('should render the LineChart title', () => {
  render(
    <LineChart
      healthIndicatorData={mockHealthData[1]}
      LineChartTitle="See how the indicator has changed over time for the area"
    />
  );

  const title = screen.getByRole('heading', { level: 3 });

  expect(title).toHaveTextContent(
    'See how the indicator has changed over time for the area'
  );
});

it('should validate checkbox is checked when passed in the correct URL query param of lineChart', async () => {
  const confidenceIntervalData = ['lineChart'];
  render(<LineChart healthIndicatorData={mockHealthData[1]} />);

  expect(confidenceIntervalData.some((ci) => ci === 'lineChart')).toBe(true);

  await userEvent.click(screen.getByRole('checkbox'));

  expect(screen.getByRole('checkbox')).toBeChecked();
});

it('should validate checkbox is not checked when passed in an incorrect URL query param of randomChart', async () => {
  const confidenceIntervalData = ['randomChart'];
  render(<LineChart healthIndicatorData={mockHealthData[1]} />);

  expect(confidenceIntervalData.some((ci) => ci === 'lineChart')).toBe(false);
  expect(screen.getByRole('checkbox')).not.toBeChecked();
});
