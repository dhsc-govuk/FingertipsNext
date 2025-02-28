import { render, screen } from '@testing-library/react';
import { Chart } from '@/components/pages/chart/index';
import { expect } from '@jest/globals';
import { mockHealthData } from '@/mock/data/healthdata';
import { PopulationDataForArea } from '@/lib/chartHelpers/preparePopulationData';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { getMapData } from '@/lib/thematicMapUtils/getMapData';

const lineChartTestId = 'lineChart-component';
const lineChartTableTestId = 'lineChartTable-component';
const lineChartContainerTestId = 'tabContainer-lineChartAndTable';
const lineChartContainerTitle = 'See how the indicator has changed over time';

const assertLineChartAndTableInDocument = () => {
  expect(screen.getByTestId(lineChartTestId)).toBeInTheDocument();
  expect(screen.getByTestId(lineChartTableTestId)).toBeInTheDocument();
  expect(screen.getByTestId(lineChartContainerTestId)).toBeInTheDocument();

  expect(
    screen.getByRole('heading', {
      name: lineChartContainerTitle,
    })
  ).toBeInTheDocument();
};

const assertLineChartAndTableNotInDocument = () => {
  expect(screen.queryByTestId(lineChartTestId)).not.toBeInTheDocument();
  expect(screen.queryByTestId(lineChartTableTestId)).not.toBeInTheDocument();
  expect(
    screen.queryByTestId(lineChartContainerTestId)
  ).not.toBeInTheDocument();

  expect(
    screen.queryByRole('heading', {
      name: lineChartContainerTitle,
    })
  ).not.toBeInTheDocument();
};

const mockPopulationData: PopulationDataForArea = {
  ageCategories: [],
  femaleSeries: [],
  maleSeries: [],
};

const state: SearchStateParams = {
  [SearchParams.SearchedIndicator]: 'test',
  [SearchParams.IndicatorsSelected]: ['1', '2'],
};

jest.mock('@/components/organisms/LineChart/', () => {
  return {
    LineChart: function LineChart() {
      return <div data-testid="lineChart-component"></div>;
    },
  };
});

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
  describe('Navigation', () => {
    it('should render back link with correct search parameters', () => {
      render(
        <Chart healthIndicatorData={[mockHealthData[1]]} searchState={state} />
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
    const state: SearchStateParams = {
      [SearchParams.SearchedIndicator]: 'test',
      [SearchParams.IndicatorsSelected]: ['0'],
      [SearchParams.AreasSelected]: ['A1245'],
    };
    render(
      <Chart
        healthIndicatorData={[mockHealthData['337']]}
        searchState={state}
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
    assertLineChartAndTableInDocument();
    expect(screen.getByTestId('barChart-component')).toBeInTheDocument();
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
      searchState={state}
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
    <Chart
      healthIndicatorData={[mockHealthData['92420']]}
      mapData={mapData}
      searchState={state}
    />
  );

  const thematicMap = screen.queryByTestId('thematicMap-component');
  expect(thematicMap).toBeInTheDocument();
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

describe('should display inequalities', () => {
  it('should display inequalities when single indicator and a single area is selected', () => {
    const state: SearchStateParams = {
      [SearchParams.IndicatorsSelected]: ['1'],
      [SearchParams.AreasSelected]: ['A1'],
    };
    render(
      <Chart healthIndicatorData={[mockHealthData['1']]} searchState={state} />
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
      />
    );

    expect(
      screen.queryByTestId('inequalities-component')
    ).not.toBeInTheDocument();
  });
});

describe('should not display line chart', () => {
  it('should not display line chart and line chart table when multiple indicators are selected', () => {
    const state: SearchStateParams = {
      [SearchParams.SearchedIndicator]: 'test',
      [SearchParams.IndicatorsSelected]: ['0', '1'],
      [SearchParams.AreasSelected]: ['A1245'],
    };

    render(
      <Chart healthIndicatorData={[mockHealthData['1']]} searchState={state} />
    );

    assertLineChartAndTableNotInDocument();
  });

  it('should not display line chart and line chart table when more than 2 area codes are selected', () => {
    const state: SearchStateParams = {
      [SearchParams.SearchedIndicator]: 'test',
      [SearchParams.IndicatorsSelected]: ['0'],
      [SearchParams.AreasSelected]: ['A1425', 'A1426', 'A1427'],
    };
    render(
      <Chart healthIndicatorData={[mockHealthData['1']]} searchState={state} />
    );

    assertLineChartAndTableNotInDocument();
  });

  it('should not display line chart and line chart table when there are less than 2 time periods per area selected', () => {
    const MOCK_DATA = [
      {
        areaCode: 'A1',
        areaName: 'Area 1',
        healthData: [mockHealthData['1'][0].healthData[0]],
      },
    ];

    const state: SearchStateParams = {
      [SearchParams.IndicatorsSelected]: ['0'],
    };

    render(<Chart healthIndicatorData={[MOCK_DATA]} searchState={state} />);

    assertLineChartAndTableNotInDocument();
  });

  describe('metadata', () => {
    it('should display data source when a single indicator is selected and metadata exists', () => {
      const state: SearchStateParams = {
        [SearchParams.SearchedIndicator]: 'test',
        [SearchParams.IndicatorsSelected]: ['123'],
        [SearchParams.AreasSelected]: ['A1245'],
      };

      const metadata = {
        indicatorID: '123',
        indicatorName: 'pancakes eaten',
        indicatorDefinition: 'number of pancakes consumed',
        dataSource: 'BJSS Leeds',
        earliestDataPeriod: '2025',
        latestDataPeriod: '2025',
        lastUpdatedDate: new Date('March 4, 2025'),
        associatedAreaCodes: ['E06000047'],
        unitLabel: 'pancakes',
      };
      render(
        <Chart
          healthIndicatorData={[mockHealthData['337']]}
          searchState={state}
          indicatorMetadata={metadata}
        />
      );

      expect(screen.getByText('Data source:', { exact: false })).toBeVisible();
    });

    it('should not display data source when a single indicator is selected but no metadata exists', () => {
      const state: SearchStateParams = {
        [SearchParams.SearchedIndicator]: 'test',
        [SearchParams.IndicatorsSelected]: ['123'],
        [SearchParams.AreasSelected]: ['A1245'],
      };

      render(
        <Chart
          healthIndicatorData={[mockHealthData['337']]}
          searchState={state}
          indicatorMetadata={undefined}
        />
      );

      expect(
        screen.queryByText('Data source:', { exact: false })
      ).not.toBeInTheDocument();
    });

    it('should not display data source when multiple indicators are selected and metadata is passed in', () => {
      const state: SearchStateParams = {
        [SearchParams.SearchedIndicator]: 'test',
        [SearchParams.IndicatorsSelected]: ['123', '456'],
        [SearchParams.AreasSelected]: ['A1245'],
      };

      const metadata = {
        indicatorID: '123',
        indicatorName: 'pancakes eaten',
        indicatorDefinition: 'number of pancakes consumed',
        dataSource: 'BJSS Leeds',
        earliestDataPeriod: '2025',
        latestDataPeriod: '2025',
        lastUpdatedDate: new Date('March 4, 2025'),
        associatedAreaCodes: ['E06000047'],
        unitLabel: 'pancakes',
      };

      render(
        <Chart
          healthIndicatorData={[mockHealthData['337']]}
          searchState={state}
          indicatorMetadata={metadata}
        />
      );

      expect(
        screen.queryByText('Data source:', { exact: false })
      ).not.toBeInTheDocument();
    });

    it('should not display data source when multiple indicators are selected and no metadata is passed in', () => {
      const state: SearchStateParams = {
        [SearchParams.SearchedIndicator]: 'test',
        [SearchParams.IndicatorsSelected]: ['123', '456'],
        [SearchParams.AreasSelected]: ['A1245'],
      };

      render(
        <Chart
          healthIndicatorData={[mockHealthData['337']]}
          searchState={state}
          indicatorMetadata={undefined}
        />
      );

      expect(
        screen.queryByText('Data source:', { exact: false })
      ).not.toBeInTheDocument();
    });
  });
});
