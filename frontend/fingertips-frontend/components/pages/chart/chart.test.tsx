import { render, screen } from '@testing-library/react';
import { Chart } from '@/components/pages/chart/index';
import { expect } from '@jest/globals';
import { mockHealthData } from '@/mock/data/healthdata';
import { PopulationDataForArea } from '@/lib/chartHelpers/preparePopulationData';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';

const mockPopulationData: PopulationDataForArea = {
  ageCategories: [],
  femaleSeries: [],
  maleSeries: [],
};

const state: SearchStateParams = {
  [SearchParams.SearchedIndicator]: 'test',
  [SearchParams.IndicatorsSelected]: ['1', '2'],
};

jest.mock('@/components/organisms/ThematicMap/', () => {
  return {
    ThematicMap: function ThematicMap() {
      return <div data-testid="thematicMap-component"></div>;
    },
  };
});

jest.mock('next/navigation', () => {
  const originalModule = jest.requireActual('next/navigation');

  return {
    ...originalModule,
    usePathname: jest.fn(),
    useRouter: jest.fn().mockImplementation(() => ({
      replace: jest.fn(),
    })),
  };
});

describe('Page structure', () => {
  it('should render the PopulationPyramid component when Population data are provided', () => {
    render(
      <Chart
        healthIndicatorData={[mockHealthData[1]]}
        populationData={{
          dataForSelectedArea: mockPopulationData,
          dataForEngland: undefined,
          dataForBaseline: undefined,
        }}
        searchState={state}
      />
    );

    const populationPyramid = screen.getByTestId('populationPyramid-component');
    expect(populationPyramid).toBeInTheDocument();
  });

  it('should _not_ render the ThematicMap component when map props are _not_ provided', () => {
    render(
      <Chart
        healthIndicatorData={[mockHealthData['92420']]}
        searchState={state}
      />
    );
    const thematicMap = screen.queryByTestId('thematicMap-component');

    expect(thematicMap).not.toBeInTheDocument();
  });
});
