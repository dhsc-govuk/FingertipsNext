import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { mockHealthData } from '@/mock/data/healthdata';
import { PopulationPyramid } from '.';

test('should render the Highcharts react component within the PopulationPyramid component', () => {
  render(<PopulationPyramid data={mockHealthData} />);
  const highcharts = screen.getByTestId('highcharts-react-component');
  expect(highcharts).toBeInTheDocument();
});

it('Should render the PopulationPyramid component title', () => {
  render(
    <PopulationPyramid
      populationPyramidTitle={'VALID population pyramid title'}
      data={mockHealthData}
    />
  );

  const HTag = screen.getByRole('heading', { level: 4 });
  expect(HTag).toHaveTextContent('VALID population pyramid title');
});
