import { render, screen } from '@testing-library/react';
import { Chart } from '@/components/pages/chart/index';
import { expect } from '@jest/globals';
import { registryWrapper } from '@/lib/testutils';

const mockData: HealthCareData[] = [
  { areaCode: 'A1426', healthData: [ {  year: 2023,
      count: 222,
      value: 506.60912,
      lowerCi: 441.69151,
      upperCi: 578.32766
    }, {  year: 2023,
      count: 222,
      value: 506.60912,
      lowerCi: 441.69151,
      upperCi: 578.32766
    }, {  year: 2023,
      count: 222,
      value: 506.60912,
      lowerCi: 441.69151,
      upperCi: 578.32766
    }] },
  { areaCode: 'A1426', healthData: [ {  year: 2023,
      count: 222,
      value: 506.60912,
      lowerCi: 441.69151,
      upperCi: 578.32766
    }, {  year: 2023,
      count: 222,
      value: 506.60912,
      lowerCi: 441.69151,
      upperCi: 578.32766
    } ] }
  ];


  test('should render the LineChart component', () => {
  render(registryWrapper(<Chart data={mockData} />));
  const lineChart = screen.getByTestId('lineChart-component');
  expect(lineChart).toBeInTheDocument();
});

test('should render the LineChart component title', () => {
  render(registryWrapper(<Chart data={mockData} />));

  const lineChartTitle = screen.getByText('Line Chart');
  expect(lineChartTitle).toBeInTheDocument();
});

test('should render the LineChartTable component', () => {
  render(registryWrapper(<Chart data={mockData} />));

  const table = screen.getByRole('table');
  expect(table).toBeInTheDocument();
});
