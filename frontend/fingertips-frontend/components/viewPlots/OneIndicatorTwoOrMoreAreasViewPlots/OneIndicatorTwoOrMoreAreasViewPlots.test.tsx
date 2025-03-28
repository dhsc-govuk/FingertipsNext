import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { OneIndicatorTwoOrMoreAreasViewPlots } from '.';
import { render, screen, waitFor } from '@testing-library/react';
import { mockHealthData } from '@/mock/data/healthdata';
import { IndicatorWithHealthDataForArea } from '@/generated-sources/ft-api-client';
import regionsMap from '@/assets/maps/Regions_December_2023_Boundaries_EN_BUC_1958740832896680092.geo.json';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';
import { MapGeographyData } from '@/components/organisms/ThematicMap/thematicMapHelpers';

jest.mock('next/navigation', () => {
  const originalModule = jest.requireActual('next/navigation');

  return {
    ...originalModule,
    useRouter: jest.fn().mockImplementation(() => ({})),
  };
});

const mockMapGeographyData: MapGeographyData = {
  mapFile: regionsMap,
  mapGroupBoundary: regionsMap,
};

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
const testHealthData: IndicatorWithHealthDataForArea = {
  areaHealthData: [mockHealthData['108'][1], mockHealthData['108'][2]],
};

const searchState: SearchStateParams = {
  [SearchParams.SearchedIndicator]: mockSearch,
  [SearchParams.IndicatorsSelected]: mockIndicator,
};

const lineChartTestId = 'standardLineChart-component';
const lineChartTableTestId = 'lineChartTable-component';
const lineChartContainerTestId = 'tabContainer-lineChartAndTable';
const lineChartContainerTitle = 'Indicator data over time';
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
  describe('LineChart components', () => {
    it('should render the LineChart components when there are 2 areas', async () => {
      render(
        <OneIndicatorTwoOrMoreAreasViewPlots
          indicatorData={testHealthData}
          searchState={{
            ...searchState,
            [SearchParams.AreasSelected]: mockAreas,
          }}
          indicatorMetadata={mockMetaData}
        />
      );
      await assertLineChartAndTableInDocument();
    });

    it('should display data source in the LineChart when metadata exists', async () => {
      render(
        <OneIndicatorTwoOrMoreAreasViewPlots
          indicatorData={testHealthData}
          searchState={{
            ...searchState,
            [SearchParams.AreasSelected]: mockAreas,
          }}
          indicatorMetadata={mockMetaData}
        />
      );
      const actual = await screen.findAllByText('Data source:', {
        exact: false,
      });
      expect(actual[0]).toBeVisible();
    });

    it('should not display LineChart components when there are less than 2 time periods per area selected', async () => {
      const MOCK_DATA = {
        areaHealthData: [
          {
            areaCode: 'A1',
            areaName: 'Area 1',
            healthData: [mockHealthData['1'][0].healthData[0]],
          },
        ],
      };

      const state: SearchStateParams = {
        [SearchParams.IndicatorsSelected]: ['0'],
        [SearchParams.AreasSelected]: ['A001'],
      };

      render(
        <OneIndicatorTwoOrMoreAreasViewPlots
          indicatorData={MOCK_DATA}
          searchState={state}
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
          indicatorData={testHealthData}
          searchState={searchState}
          indicatorMetadata={mockMetaData}
        />
      );

      await waitFor(() => assertLineChartAndTableNotInDocument());
    });
  });

  it('should render the title for BarChartEmbeddedTable/ThematicMap', async () => {
    const searchState: SearchStateParams = {
      [SearchParams.SearchedIndicator]: mockSearch,
      [SearchParams.IndicatorsSelected]: mockIndicator,
      [SearchParams.AreasSelected]: ['A1245', 'A1246', 'A1427'],
    };

    render(
      <OneIndicatorTwoOrMoreAreasViewPlots
        indicatorData={testHealthData}
        searchState={searchState}
      />
    );

    expect(
      await screen.findByText('Compare an indicator by areas')
    ).toBeInTheDocument();
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
          indicatorData={testHealthData}
          searchState={searchState}
        />
      );

      expect(
        await screen.findByTestId(barChartEmbeddedTable)
      ).toBeInTheDocument();
    });
  });

  describe('ThematicMap', () => {
    it('should render the ThematicMap when all areas in a group are selected', async () => {
      const searchState: SearchStateParams = {
        [SearchParams.GroupAreaSelected]: ALL_AREAS_SELECTED,
        [SearchParams.AreaTypeSelected]: 'regions',
      };

      render(
        <OneIndicatorTwoOrMoreAreasViewPlots
          indicatorData={{
            areaHealthData: [
              mockHealthData[108][1],
              mockHealthData[108][2],
              mockHealthData[108][3],
            ],
          }}
          searchState={searchState}
          mapGeographyData={mockMapGeographyData}
        />
      );
      expect(
        await screen.findByTestId('thematicMap-component')
      ).toBeInTheDocument();
    });

    it('should not render the ThematicMap when not all areas in a group are selected', async () => {
      const searchState: SearchStateParams = {
        [SearchParams.GroupAreaSelected]: 'not ALL',
        [SearchParams.AreaTypeSelected]: 'regions',
      };

      render(
        <OneIndicatorTwoOrMoreAreasViewPlots
          indicatorData={{
            areaHealthData: [
              mockHealthData[108][1],
              mockHealthData[108][2],
              mockHealthData[108][3],
            ],
          }}
          searchState={searchState}
          mapGeographyData={mockMapGeographyData}
        />
      );

      await waitFor(() => {
        expect(
          screen.queryByTestId('thematicMap-component')
        ).not.toBeInTheDocument();
      });
    });
  });
});
