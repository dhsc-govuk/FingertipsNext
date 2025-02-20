import { render, screen } from '@testing-library/react';
import { Chart } from '@/components/pages/chart/index';
import { expect } from '@jest/globals';
import { mockHealthData } from '@/mock/data/healthdata';
import { PopulationDataForArea } from '@/lib/chartHelpers/preparePopulationData';
import { SearchParams } from '@/lib/searchStateManager';
import { getMapData } from '@/lib/thematicMapUtils/getMapData';

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
    useSearchParams: jest.fn(),
    useRouter: jest.fn().mockImplementation(() => ({
      replace: jest.fn(),
    })),
  };
});

const mockPopulationData: PopulationDataForArea = {
  ageCategories: [],
  femaleSeries: [],
  maleSeries: [],
};

describe('Page structure', () => {
  describe('Navigation', () => {
    it('should render back link with correct search parameters', () => {
      render(
        <Chart
          healthIndicatorData={[mockHealthData[1]]}
          searchedIndicator="test"
          indicatorsSelected={['1', '2']}
        />
      );

      const backLink = screen.getByRole('link', { name: /back/i });
      const expectedUrl = `/results?${SearchParams.SearchedIndicator}=test&${SearchParams.IndicatorsSelected}=1&${SearchParams.IndicatorsSelected}=2`;

      expect(backLink).toBeInTheDocument();
      expect(backLink).toHaveAttribute('data-testid', 'chart-page-back-link');
      expect(backLink).toHaveAttribute('href', expectedUrl);
    });
  });
});

describe('Content', () => {
  beforeEach(() => {
    render(
      <Chart
        healthIndicatorData={[mockHealthData['337']]}
        indicatorsSelected={['0']}
      />
    );
  });

  it('should render the title with correct text', () => {
    const heading = screen.getByRole('heading', { level: 2 });

    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(
      'View data for selected indicators and areas'
    );
  });

  it('should render the chart components', () => {
    const lineChart = screen.getByTestId('lineChart-component');
    const barChart = screen.getByTestId('barChart-component');
    const lineChartTable = screen.getByTestId('lineChartTable-component');

    expect(lineChart).toBeInTheDocument();
    expect(barChart).toBeInTheDocument();
    expect(lineChartTable).toBeInTheDocument();
  });
});

it('should render the PopulationPyramid component when Population data are provided', () => {
  render(
    <Chart
      healthIndicatorData={[mockHealthData[1]]}
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

it('should render the ThematicMap component when all map props are provided', () => {
  const areaType = 'regions';
  const areaCodes = ['E12000001', 'E12000002'];
  const mapData = getMapData(areaType, areaCodes);

  render(
    <Chart healthIndicatorData={[mockHealthData['318']]} mapData={mapData} />
  );

  const thematicMap = screen.queryByTestId('thematicMap-component');
  expect(thematicMap).toBeInTheDocument();
});

it('should _not_ render the ThematicMap component when map props are _not_ provided', async () => {
  render(<Chart healthIndicatorData={[mockHealthData['318']]} />);
  const thematicMap = screen.queryByTestId('thematicMap-component');

  expect(thematicMap).not.toBeInTheDocument();
});

it('should display inequalities sex table when single indicator and a single area is selected', () => {
  render(
    <Chart
      healthIndicatorData={[mockHealthData['318']]}
      indicatorsSelected={['318']}
      areasSelected={['A1']}
    />
  );

  expect(
    screen.queryByTestId('inequalitiesSexTable-component')
  ).toBeInTheDocument();
});

it('should not display inequalities sex table when multiple indicators are selected', () => {
  render(
    <Chart
      healthIndicatorData={[mockHealthData['318']]}
      indicatorsSelected={['318', '1']}
      areasSelected={['A1']}
    />
  );

  expect(
    screen.queryByTestId('inequalitiesSexTable-component')
  ).not.toBeInTheDocument();
});

it('should not display inequalities sex table when multiple areas are selected', () => {
  render(
    <Chart
      healthIndicatorData={[mockHealthData['318']]}
      indicatorsSelected={['318']}
      areasSelected={['A1', 'A2']}
    />
  );

  expect(
    screen.queryByTestId('inequalitiesSexTable-component')
  ).not.toBeInTheDocument();
});

describe('should not display line chart', () => {
  it('should not display line chart and line chart table when multiple indicators are selected', () => {
    render(
      <Chart
        healthIndicatorData={[mockHealthData['1']]}
        indicatorsSelected={['0', '1']}
      />
    );

    expect(screen.queryByTestId('lineChart-component')).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('lineChartTable-component')
    ).not.toBeInTheDocument();
  });

  it('should not display line chart and line chart table when more than 2 area codes are selected', () => {
    render(
      <Chart
        healthIndicatorData={[mockHealthData['1']]}
        indicatorsSelected={['0']}
        areasSelected={['A1425', 'A1426', 'A1427']}
      />
    );

    expect(screen.queryByTestId('lineChart-component')).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('lineChartTable-component')
    ).not.toBeInTheDocument();
  });

  it('should not display line chart and line chart table when there are less than 2 time periods per area selected', () => {
    const MOCK_DATA = [
      {
        areaCode: 'A1',
        areaName: 'Area 1',
        healthData: [mockHealthData['1'][0].healthData[0]],
      },
    ];

    render(
      <Chart healthIndicatorData={[MOCK_DATA]} indicatorsSelected={['0']} />
    );

    expect(screen.queryByTestId('lineChart-component')).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('lineChartTable-component')
    ).not.toBeInTheDocument();
  });
});
