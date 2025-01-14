import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { LineChartTable } from '@/components/organisms/LineChartTable/index';

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
    areaCode: 'A1425',
    healthData: [
      {
        count: 389,
        lowerCi: 441.69151,
        upperCi: 578.32766,
        value: 278.29134,
        year: 2006,
        sex: '',
        ageBand: '',
      },
      {
        count: 267,
        lowerCi: 441.69151,
        upperCi: 578.32766,
        value: 703.420759,
        year: 2004,
        sex: '',
        ageBand: '',
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
        sex: '',
        ageBand: '',
      },
      {
        count: 267,
        lowerCi: 441.69151,
        upperCi: 578.32766,
        value: 703.420759,
        year: 2004,
        sex: '',
        ageBand: '',
      },
    ],
  },
];

it('snapshot test - should match snapshot', () => {
  const container = render(
    <LineChartTable data={mockData} headings={mockHeadings} />
  );
  expect(container.asFragment()).toMatchSnapshot();
});

it('should render the LineChartTable component', () => {
  render(<LineChartTable data={mockData} headings={mockHeadings} />);
  const lineChart = screen.getByTestId('lineChartTable-component');
  expect(lineChart).toBeInTheDocument();
});
