import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { OneIndicatorTwoOrMoreAreasViewPlots } from '.';
import { render, screen, waitFor } from '@testing-library/react';
import { mockHealthData } from '@/mock/data/healthdata';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';

jest.mock('next/navigation', () => {
  const originalModule = jest.requireActual('next/navigation');

  return {
    ...originalModule,
    useRouter: jest.fn().mockImplementation(() => ({})),
  };
});

const mockMetaData = {
  indicatorID: '108',
  indicatorName: 'pancakes eaten',
  indicatorDefinition: 'number of pancakes consumed',
  dataSource: 'BJSS Leeds',
  earliestDataPeriod: '2025',
  latestDataPeriod: '2025',
  lastUpdatedDate: new Date('March 4, 2025'),
  associatedAreaCodes: ['E06000047'],
  unitLabel: 'pancakes',
  hasInequalities: true,
  usedInPoc: true,
};

const mockSearch = 'test';
const mockIndicator = ['108'];
const mockAreas = ['E12000001', 'E12000003'];
const testHealthData: HealthDataForArea[] = [
  mockHealthData['108'][1],
  mockHealthData['108'][2],
];

const searchState: SearchStateParams = {
  [SearchParams.SearchedIndicator]: mockSearch,
  [SearchParams.IndicatorsSelected]: mockIndicator,
};

const lineChartTestId = 'lineChart-component';
const lineChartTableTestId = 'lineChartTable-component';
const lineChartContainerTestId = 'tabContainer-lineChartAndTable';
const lineChartContainerTitle = 'See how the indicator has changed over time';
const barChartEmbeddedTable = 'barChartEmbeddedTable-component';

const assertLineChartAndTableInDocument = async () => {
  expect(await screen.findByTestId(lineChartTestId)).toBeInTheDocument();
  expect(screen.getByTestId(lineChartTableTestId)).toBeInTheDocument();
  expect(screen.getByTestId(lineChartContainerTestId)).toBeInTheDocument();

  expect(
    screen.getByRole('heading', {
      name: lineChartContainerTitle,
    })
  ).toBeInTheDocument();
};

const assertLineChartAndTableNotInDocument = async () => {
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

describe('OneIndicatorTwoOrMoreAreasViewPlots', () => {
  it('should render the view with correct title', async () => {
    render(
      <OneIndicatorTwoOrMoreAreasViewPlots
        healthIndicatorData={testHealthData}
        searchState={searchState}
        areaCodes={mockAreas}
      />
    );

    const heading = await screen.findByRole('heading', { level: 2 });

    expect(
      screen.getByTestId('oneIndicatorTwoOrMoreAreasViewPlots-component')
    ).toBeInTheDocument();
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(
      'View data for selected indicators and areas'
    );
  });

  it('should render the LineChart components when there are 2 areas', async () => {
    render(
      <OneIndicatorTwoOrMoreAreasViewPlots
        healthIndicatorData={testHealthData}
        searchState={searchState}
        indicatorMetadata={mockMetaData}
        areaCodes={mockAreas}
      />
    );
    await assertLineChartAndTableInDocument();
  });

  it('should display data source when metadata exists', async () => {
    render(
      <OneIndicatorTwoOrMoreAreasViewPlots
        healthIndicatorData={testHealthData}
        searchState={searchState}
        indicatorMetadata={mockMetaData}
        areaCodes={mockAreas}
      />
    );
    const actual = await screen.findAllByText('Data source:', { exact: false });
    expect(actual[0]).toBeVisible();
  });

  it('should not display LineChart components when there are less than 2 time periods per area selected', async () => {
    const MOCK_DATA = [
      {
        areaCode: 'A1',
        areaName: 'Area 1',
        healthData: [mockHealthData['1'][0].healthData[0]],
      },
    ];

    const state: SearchStateParams = {
      [SearchParams.IndicatorsSelected]: ['0'],
      [SearchParams.AreasSelected]: ['A001'],
    };

    render(
      <OneIndicatorTwoOrMoreAreasViewPlots
        healthIndicatorData={MOCK_DATA}
        searchState={state}
        areaCodes={mockAreas}
      />
    );

    await waitFor(() => assertLineChartAndTableNotInDocument());
  });

  it('should not render the LineChart components when there are more than 2 areas', async () => {
    const searchState: SearchStateParams = {
      [SearchParams.SearchedIndicator]: mockSearch,
      [SearchParams.IndicatorsSelected]: mockIndicator,
      [SearchParams.AreasSelected]: [...mockAreas, 'A003'],
    };

    render(
      <OneIndicatorTwoOrMoreAreasViewPlots
        healthIndicatorData={testHealthData}
        searchState={searchState}
        indicatorMetadata={mockMetaData}
        areaCodes={[...mockAreas, 'third area']}
      />
    );

    await assertLineChartAndTableNotInDocument();
  });

  describe('BarChartEmbeddedTable', () => {
    it('should render the BarChartEmbeddedTable component, when two or more areas are selected', async () => {
      const searchState: SearchStateParams = {
        [SearchParams.SearchedIndicator]: mockSearch,
        [SearchParams.IndicatorsSelected]: mockIndicator,
        [SearchParams.AreasSelected]: ['A1245', 'A1246', 'A1427'],
      };

      render(
        <OneIndicatorTwoOrMoreAreasViewPlots
          healthIndicatorData={testHealthData}
          searchState={searchState}
          areaCodes={mockAreas}
        />
      );

      expect(
        await screen.findByTestId(barChartEmbeddedTable)
      ).toBeInTheDocument();
    });
  });

  it('should render the title for BarChartEmbeddedTable', async () => {
    const searchState: SearchStateParams = {
      [SearchParams.SearchedIndicator]: mockSearch,
      [SearchParams.IndicatorsSelected]: mockIndicator,
      [SearchParams.AreasSelected]: ['A1245', 'A1246', 'A1427'],
    };

    render(
      <OneIndicatorTwoOrMoreAreasViewPlots
        healthIndicatorData={testHealthData}
        searchState={searchState}
        areaCodes={mockAreas}
      />
    );

    expect(
      screen.getByText('Compare an indicator by areas')
    ).toBeInTheDocument();
  });
});
