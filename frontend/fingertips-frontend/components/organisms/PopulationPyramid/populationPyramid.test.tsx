import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { PopulationPyramid } from '.';
import { PopulationDataForArea } from '@/lib/chartHelpers/preparePopulationData';

const mockPopulationData: PopulationDataForArea = {
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
};

test('should render the Highcharts react component within the PopulationPyramid component', () => {
  render(
    <PopulationPyramid
      healthIndicatorData={{ dataForSelectedArea: mockPopulationData }}
    />
  );
  const highcharts = screen.getByTestId(
    'highcharts-react-component-populationPyramid'
  );
  expect(highcharts).toBeInTheDocument();
});

it('Should render the PopulationPyramid component title', () => {
  render(
    <PopulationPyramid
      populationPyramidTitle={'VALID population pyramid title'}
      healthIndicatorData={{ dataForSelectedArea: mockPopulationData }}
    />
  );

  const populationPyramidHeader = screen.getByRole('heading', { level: 3 });
  expect(populationPyramidHeader).toHaveTextContent(
    'VALID population pyramid title'
  );
});
