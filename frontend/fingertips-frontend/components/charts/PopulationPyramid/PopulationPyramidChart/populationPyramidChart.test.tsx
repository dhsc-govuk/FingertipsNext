import { render, screen } from '@testing-library/react';
import { PopulationDataForArea } from '@/lib/chartHelpers/preparePopulationData';
import { PopulationPyramidChart } from '@/components/charts/PopulationPyramid/PopulationPyramidChart/PopulationPyramidChart';

const mockPopulationData: PopulationDataForArea = {
  areaName: 'mock Data',
  ageCategories: [
    '90+',
    '85-89',
    '50-54',
    '20-24',
    '15-19',
    '10-14',
    '5-9',
    '0-4',
  ],
  femaleSeries: [1.58, 2.48, 8.78, 7.67, 7.49, 7.81, 7.42, 6.78],
  maleSeries: [0.79, 1.71, 8.49, 7.99, 7.95, 8.19, 7.77, 7.11],
  total: 0,
};

test('should render the Highcharts react component within the PopulationPyramid component', async () => {
  render(
    <PopulationPyramidChart
      title={'Area resident population, 2023'}
      dataForSelectedArea={mockPopulationData}
      xAxisTitle="Age"
      yAxisTitle="Population Percentage"
    />
  );
  const highcharts = await screen.findByTestId(
    'highcharts-react-component-populationPyramid'
  );
  expect(highcharts).toBeInTheDocument();

  const title = screen.getByRole('heading', { level: 4 });
  expect(title).toHaveTextContent('Area resident population, 2023');
});
