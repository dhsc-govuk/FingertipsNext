import { render, screen } from '@testing-library/react';
import { Chart } from '@/components/pages/chart/index';
import { expect } from '@jest/globals';
import { mockHealthData } from '@/mock/data/healthdata';
import { PopulationData } from '@/lib/chartHelpers/preparePopulationData';

const mockPopulationData: PopulationData = {
  ageCategories: [],
  femaleSeries: [],
  maleSeries: [],
};

it('should render the backLink', () => {
  render(
    <Chart
      data={mockHealthData}
      indicator="test"
      indicatorsSelected={['1', '2']}
      preparedPopulationData={{
        dataForSelectedArea: mockPopulationData,
        dataForEngland: undefined,
        dataForBaseline: undefined,
      }}
    />
  );

  expect(screen.getByRole('link', { name: /back/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /back/i }).getAttribute('href')).toBe(
    '/search/results?indicator=test&indicatorsSelected=1%2C2'
  );
});

it('should render the LineChart component', () => {
  render(
    <Chart
      data={mockHealthData}
      preparedPopulationData={{
        dataForSelectedArea: mockPopulationData,
        dataForEngland: undefined,
        dataForBaseline: undefined,
      }}
    />
  );
  const lineChart = screen.getByTestId('lineChart-component');
  expect(lineChart).toBeInTheDocument();
});

it('should render the LineChart component title', () => {
  render(
    <Chart
      data={mockHealthData}
      preparedPopulationData={{
        dataForSelectedArea: mockPopulationData,
        dataForEngland: undefined,
        dataForBaseline: undefined,
      }}
    />
  );

  const HTag = screen.getByRole('heading', { level: 3 });
  expect(HTag).toHaveTextContent('Title for the chart page');
});

it('should render the LineChartTable component', () => {
  render(
    <Chart
      data={mockHealthData}
      preparedPopulationData={{
        dataForSelectedArea: mockPopulationData,
        dataForEngland: undefined,
        dataForBaseline: undefined,
      }}
    />
  );

  const table = screen.getByRole('table');
  expect(table).toBeInTheDocument();
});

it('should render the PopulationPyramid component', () => {
  render(
    <Chart
      data={mockHealthData}
      preparedPopulationData={{
        dataForSelectedArea: mockPopulationData,
        dataForEngland: undefined,
        dataForBaseline: undefined,
      }}
    />
  );

  const PyramidPlot = screen.getByTestId('PopulationPyramid-component');
  expect(PyramidPlot).toBeInTheDocument();
});
