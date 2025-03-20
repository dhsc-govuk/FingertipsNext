import { render, screen } from '@testing-library/react';
import { Chart } from '@/components/pages/chart/index';
import { expect } from '@jest/globals';
import { PopulationDataForArea } from '@/lib/chartHelpers/preparePopulationData';

const mockPopulationData: PopulationDataForArea = {
  ageCategories: [],
  femaleSeries: [],
  maleSeries: [],
};

describe('Page structure', () => {
  it('should render the PopulationPyramid component when Population data are provided', () => {
    render(
      <Chart
        populationData={{
          dataForSelectedArea: mockPopulationData,
          dataForEngland: undefined,
          dataForBaseline: undefined,
        }}
      />
    );

    const populationPyramid = screen.getByTestId('populationPyramid-component');
    expect(populationPyramid).toBeInTheDocument();
  });
});
