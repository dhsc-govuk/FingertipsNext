// MUST BE AT THE TOP DUE TO HOISTING OF MOCKED MODULES
import { mockUsePathname } from '@/mock/utils/mockNextNavigation';
import { mockSetIsLoading } from '@/mock/utils/mockUseLoadingState';
import { mockUseSearchStateParams } from '@/mock/utils/mockUseSearchStateParams';
//
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { OneIndicatorTwoOrMoreAreasViewPlots } from '.';
import { screen, waitFor, within } from '@testing-library/react';
import {
  Area,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import regionsMap from '@/components/charts/ThematicMap/regions.json';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';
import { mockIndicatorDocument } from '@/mock/data/mockIndicatorDocument';
import { mockIndicatorWithHealthDataForArea } from '@/mock/data/mockIndicatorWithHealthDataForArea';
import { mockHealthDataForArea } from '@/mock/data/mockHealthDataForArea';
import { mockHealthDataPointsNew } from '@/mock/data/mockHealthDataPoint';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { oneIndicatorRequestParams } from '@/components/charts/helpers/oneIndicatorRequestParams';
import {
  EndPoints,
  queryKeyFromRequestParams,
} from '@/components/charts/helpers/queryKeyFromRequestParams';
import { mockIndicatorSegment } from '@/mock/data/mockIndicatorSegment';
import { testRenderQueryClient } from '@/mock/utils/testRenderQueryClient';
import { SeedData } from '@/components/atoms/SeedQueryCache/seedQueryCache.types';

const mockPath = 'some-mock-path';
mockUsePathname.mockReturnValue(mockPath);
mockSetIsLoading(false);

const lineChartTestId = 'standardLineChart-component';
const lineChartTableTestId = 'lineChartTable-component';
const lineChartContainerTestId = 'tabContainer-lineChartAndTable';
const lineChartContainerTitle = 'Indicator trends over time';
const barChartEmbeddedTable = 'barChartEmbeddedTable-component';
const lineChartSegmentationOptions = 'segmentation-options';

const assertLineChartAndTableInDocument = async () => {
  expect(await screen.findByTestId(lineChartTestId)).toBeInTheDocument();
  expect(screen.getByTestId(lineChartTableTestId)).toBeInTheDocument();
  expect(screen.getByTestId(lineChartContainerTestId)).toBeInTheDocument();
  expect(screen.getByTestId(lineChartSegmentationOptions)).toBeInTheDocument();

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

const testMetaData = mockIndicatorDocument();
const testHealthData = mockIndicatorWithHealthDataForArea({
  areaHealthData: [
    mockHealthDataForArea({
      areaCode: 'E12000004',
      areaName: 'Area1',
      healthData: mockHealthDataPointsNew([{ year: 2023 }, { year: 2022 }]),
      indicatorSegments: [
        mockIndicatorSegment({
          healthData: mockHealthDataPointsNew([{ year: 2023 }, { year: 2022 }]),
        }),
      ],
    }),
    mockHealthDataForArea({
      areaCode: 'E12000006',
      areaName: 'Area2',
      healthData: mockHealthDataPointsNew([{ year: 2023 }, { year: 2022 }]),
      indicatorSegments: [
        mockIndicatorSegment({
          healthData: mockHealthDataPointsNew([{ year: 2023 }, { year: 2022 }]),
        }),
      ],
    }),
  ],
});

const mockSearch = 'test';
const mockAreas = testHealthData?.areaHealthData?.map(
  (area) => area.areaCode ?? []
);
const mockSearchState = {
  [SearchParams.SearchedIndicator]: mockSearch,
  [SearchParams.IndicatorsSelected]: [testMetaData.indicatorID],
  [SearchParams.AreasSelected]: mockAreas,
};

const testRender = async (
  searchState: SearchStateParams,
  healthData: IndicatorWithHealthDataForArea,
  indicatorMetadata?: IndicatorDocument
) => {
  mockUseSearchStateParams.mockReturnValue(searchState);

  // available areas
  const availableAreas: Area[] =
    healthData.areaHealthData?.map(
      (area) => ({ code: area.areaCode, name: area.areaName }) as Area
    ) ?? [];

  // seed line chart over time data
  const oneIndicatorParams = oneIndicatorRequestParams(
    searchState,
    availableAreas
  );
  const oneIndicatorQueryKey = queryKeyFromRequestParams(
    EndPoints.HealthDataForAnIndicator,
    oneIndicatorParams
  );

  const seedData: SeedData = {
    availableAreas,
    'map-geo-json/regions': regionsMap,
    [oneIndicatorQueryKey]: healthData,
  };

  if (indicatorMetadata) {
    seedData[`/indicator/${indicatorMetadata.indicatorID}`] = indicatorMetadata;
  }

  await testRenderQueryClient(
    <OneIndicatorTwoOrMoreAreasViewPlots indicatorData={healthData} />,
    seedData
  );
};

describe('OneIndicatorTwoOrMoreAreasViewPlots', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.resetAllMocks();
  });

  it('should render the benchmark select area drop down for the view', async () => {
    await testRender(mockSearchState, testHealthData, testMetaData);

    await waitFor(async () => {
      const benchmarkAreaDropDown = screen.getByRole('combobox', {
        name: 'Select a benchmark for all charts',
      });
      const benchmarkAreaDropDownOptions = within(
        benchmarkAreaDropDown
      ).getAllByRole('option');

      expect(benchmarkAreaDropDown).toBeInTheDocument();
      expect(benchmarkAreaDropDownOptions).toHaveLength(1);
      benchmarkAreaDropDownOptions.forEach((option) => {
        expect(option.textContent).toBe('England');
      });
    });
  });

  describe('LineChart components', () => {
    it('should render the LineChart components when there are 2 areas', async () => {
      await testRender(mockSearchState, testHealthData, testMetaData);
      await assertLineChartAndTableInDocument();
    });

    it('should display data source in the LineChart when metadata exists', async () => {
      await testRender(mockSearchState, testHealthData, testMetaData);
      const actual = await screen.findAllByText('Data source:', {
        exact: false,
      });
      expect(actual[0]).toBeVisible();
    });

    it('should not display LineChart components when there are less than 2 time periods per area selected', async () => {
      await testRender(
        mockSearchState,
        mockIndicatorWithHealthDataForArea(),
        testMetaData
      );

      await waitFor(() => assertLineChartAndTableNotInDocument());
    });

    it('should not render the LineChart components when there are more than 2 areas', async () => {
      await testRender(mockSearchState, testHealthData, undefined);
      await waitFor(() => assertLineChartAndTableNotInDocument());
    });
  });

  describe('BarChartEmbeddedTable', () => {
    it('should render the BarChartEmbeddedTable component, when two or more areas are selected', async () => {
      await testRender(mockSearchState, testHealthData, testMetaData);

      expect(
        await screen.findByTestId(barChartEmbeddedTable)
      ).toBeInTheDocument();
    });

    it('should render the title for BarChartEmbeddedTable', async () => {
      await testRender(mockSearchState, testHealthData, testMetaData);
      expect(
        await screen.findByText('Compare areas for one time period')
      ).toBeInTheDocument();
    });
  });

  describe('ThematicMap', () => {
    const mockSearchStateAllAreas = {
      [SearchParams.IndicatorsSelected]: [testMetaData.indicatorID],
      [SearchParams.GroupAreaSelected]: ALL_AREAS_SELECTED,
      [SearchParams.GroupSelected]: 'E12000003',
      [SearchParams.AreaTypeSelected]: 'regions',
    };

    const mockSearchStateNotAllAreas = {
      ...mockSearchStateAllAreas,
      [SearchParams.GroupAreaSelected]: 'not_all_areas',
    };

    it('should render the ThematicMap with title', async () => {
      await testRender(mockSearchStateAllAreas, testHealthData, testMetaData);
      await waitFor(async () => {
        expect(
          await screen.findByTestId('thematicMap-component')
        ).toBeInTheDocument();

        expect(
          await screen.findAllByText('Compare an indicator by areas')
        ).toHaveLength(1);
      });
    });

    it('should not render the ThematicMap when not all areas in a group are selected', async () => {
      await testRender(
        mockSearchStateNotAllAreas,
        testHealthData,
        testMetaData
      );
      await waitFor(() => {
        expect(
          screen.queryByTestId('thematicMap-component')
        ).not.toBeInTheDocument();
      });
    });
  });
});
