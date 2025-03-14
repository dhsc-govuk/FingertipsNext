import { render, screen } from '@testing-library/react';
import { Chart } from '@/components/pages/chart/index';
import { expect } from '@jest/globals';
import { mockHealthData } from '@/mock/data/healthdata';
import { PopulationDataForArea } from '@/lib/chartHelpers/preparePopulationData';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { getMapData } from '@/lib/thematicMapUtils/getMapData';

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
describe('should display inequalities', () => {
  it('should display inequalities when single indicator and a single area is selected', () => {
    const state: SearchStateParams = {
      [SearchParams.IndicatorsSelected]: ['1'],
      [SearchParams.AreasSelected]: ['A1'],
    };
    render(
      <Chart
        healthIndicatorData={[mockHealthData['337']]}
        searchState={state}
      />
    );

    expect(screen.queryByTestId('inequalities-component')).toBeInTheDocument();
  });

  it('should not display inequalities when multiple indicators are selected', () => {
    const state: SearchStateParams = {
      [SearchParams.IndicatorsSelected]: ['337', '1'],
      [SearchParams.AreasSelected]: ['A1'],
    };
    render(
      <Chart
        healthIndicatorData={[mockHealthData['337']]}
        searchState={state}
      />
    );

    expect(
      screen.queryByTestId('inequalities-component')
    ).not.toBeInTheDocument();
  });

  it('should not display inequalities sex table when multiple areas are selected', () => {
    const state: SearchStateParams = {
      [SearchParams.IndicatorsSelected]: ['337'],
      [SearchParams.AreasSelected]: ['A1', 'A2'],
    };
    render(
      <Chart
        healthIndicatorData={[mockHealthData['337']]}
        searchState={state}
        measurementUnit="per 100,000"
      />
    );

    expect(
      screen.queryByTestId('inequalities-component')
    ).not.toBeInTheDocument();
  });
});
