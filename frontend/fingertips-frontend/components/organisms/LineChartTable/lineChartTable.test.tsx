import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { registryWrapper } from '@/lib/testutils';
import { LineChartTable } from '@/components/organisms/LineChartTable/index';

const mockData: HealthCareData[] = [
  {
    areaCode: 'A1426',
    healthData: [
      {
        year: 2023,
        count: 222,
        value: 506.60912,
        lowerCi: 441.69151,
        upperCi: 578.32766,
      },
      {
        year: 2023,
        count: 222,
        value: 506.60912,
        lowerCi: 441.69151,
        upperCi: 578.32766,
      },
      {
        year: 2023,
        count: 222,
        value: 506.60912,
        lowerCi: 441.69151,
        upperCi: 578.32766,
      },
    ],
  },
  {
    areaCode: 'A1426',
    healthData: [
      {
        year: 2023,
        count: 222,
        value: 506.60912,
        lowerCi: 441.69151,
        upperCi: 578.32766,
      },
      {
        year: 2023,
        count: 222,
        value: 506.60912,
        lowerCi: 441.69151,
        upperCi: 578.32766,
      },
    ],
  },
];

const mockHeadings = [
  'Area Code',
  'Year',
  'Count',
  'Value',
  'LowerCi',
  'UpperCi',
];

test('snapshot test - should match snapshot', () => {
  const container = render(
    registryWrapper(<LineChartTable data={mockData} headings={mockHeadings} />)
  );
  expect(container.asFragment()).toMatchSnapshot();
});

test('should render the LineChartTable component', () => {
  render(
    registryWrapper(<LineChartTable data={mockData} headings={mockHeadings} />)
  );
  const lineChart = screen.getByTestId('lineChartTable-component');
  expect(lineChart).toBeInTheDocument();
});
