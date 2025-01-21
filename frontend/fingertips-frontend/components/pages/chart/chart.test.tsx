import { render, screen } from '@testing-library/react';
import { Chart } from '@/components/pages/chart/index';
import { expect } from '@jest/globals';
import { mockHealthData } from '@/mock/data/healthdata';
import { PopulationDataForArea } from '@/lib/chartHelpers/preparePopulationData';
import { SearchParams } from '@/lib/searchStateManager';

const mockPopulationData: PopulationDataForArea = {
  ageCategories: [],
  femaleSeries: [],
  maleSeries: [],
};

it('should render the backLink', () => {
  render(
    <Chart
      data={mockHealthData[1]}
      searchedIndicator="test"
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
    `/search/results?${SearchParams.SearchedIndicator}=test&${SearchParams.IndicatorsSelected}=1&${SearchParams.IndicatorsSelected}=2`
  );
});

it('should render the LineChart component', () => {
  render(
    <Chart
      data={mockHealthData[1]}
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

it('should render the Chart component title', () => {
  render(
    <Chart
      data={mockHealthData[1]}
      preparedPopulationData={{
        dataForSelectedArea: mockPopulationData,
        dataForEngland: undefined,
        dataForBaseline: undefined,
      }}
    />
  );

  const HTag = screen.getByRole('heading', { level: 2 });
  expect(HTag).toHaveTextContent('View Dementia QOF prevalence');
});

it('should render the LineChartTable component', () => {
  render(
    <Chart
      data={mockHealthData[1]}
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

it('should render the BarChart component', () => {
  render(
    <Chart
      data={mockHealthData[1]}
      preparedPopulationData={{
        dataForSelectedArea: mockPopulationData,
        dataForEngland: undefined,
        dataForBaseline: undefined,
      }}
    />
  );
  const barChart = screen.getByTestId('barChart-component');
  expect(barChart).toBeInTheDocument();
});

it('should render the PopulationPyramid component when Population data are provided', () => {
  render(
    <Chart
      data={mockHealthData[1]}
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
