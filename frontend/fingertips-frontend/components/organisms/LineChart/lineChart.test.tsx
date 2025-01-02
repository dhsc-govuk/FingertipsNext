import { render, screen } from '@testing-library/react';
import { LineChart } from '@/components/organisms/LineChart/index';
import { expect } from '@jest/globals';
import { registryWrapper } from '@/lib/testutils';
import { HealthCareData } from '@/app/chart/health-data';

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

test('should render the Highcharts react component', () => {
  render(registryWrapper(<LineChart data={mockData} />));
  const highcharts = screen.getByTestId('highcharts-react-component');
  expect(highcharts).toBeInTheDocument();
});
