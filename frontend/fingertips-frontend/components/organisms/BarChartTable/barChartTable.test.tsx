import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { BarChartTable } from '@/components/organisms/BarChartTable/index';

const mockHeadings = [
  'Area Code',
  'Year',
  'Value',
  'Count',
  'LowerCi',
  'UpperCi',
];

const mockData = [
  {
    summary: 'Freezing',
    areaCode: 'A1425',
    healthData: [
      {
        count: 389,
        lowerCi: 441.69151,
        upperCi: 578.32766,
        value: 278.29134,
        year: 2006,
      },
      {
        count: 267,
        lowerCi: 441.69151,
        upperCi: 578.32766,
        value: 703.420759,
        year: 2004,
      },
    ],
  },
  {
    areaCode: 'A1426',
    healthData: [
      {
        count: 389,
        lowerCi: 441.69151,
        upperCi: 578.32766,
        value: 278.29134,
        year: 2006,
      },
      {
        count: 267,
        lowerCi: 441.69151,
        upperCi: 578.32766,
        value: 703.420759,
        year: 2004,
      },
    ],
  },
];

test('snapshot test - should match snapshot', () => {
  const container = render(
    <BarChartTable data={mockData} headings={mockHeadings} />
  );
  expect(container.asFragment()).toMatchSnapshot();
});

test('should render the BarChartTable component', () => {
  render(<BarChartTable data={mockData} headings={mockHeadings} />);
  const barChart = screen.getByTestId('barChartTable-component');
  expect(barChart).toBeInTheDocument();
});
