// MUST BE AT THE TOP DUE TO HOISTING OF MOCKED MODULES
import { mockUsePathname } from '@/mock/utils/mockNextNavigation';
import { mockSetIsLoading } from '@/mock/utils/mockUseLoadingState';
import { mockUseSearchStateParams } from '@/mock/utils/mockUseSearchStateParams';
import { mockHighChartsWrapperSetup } from '@/mock/utils/mockHighChartsWrapper';
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
import {
  mockHealthDataForArea,
  mockHealthDataForArea_England,
} from '@/mock/data/mockHealthDataForArea';
import { mockHealthDataPoints } from '@/mock/data/mockHealthDataPoint';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { oneIndicatorRequestParams } from '@/components/charts/helpers/oneIndicatorRequestParams';
import {
  EndPoints,
  queryKeyFromRequestParams,
} from '@/components/charts/helpers/queryKeyFromRequestParams';
import { mockIndicatorSegment } from '@/mock/data/mockIndicatorSegment';
import { testRenderQueryClient } from '@/mock/utils/testRenderQueryClient';
import { SeedData } from '@/components/atoms/SeedQueryCache/seedQueryCache.types';
import {
  chartTitleConfig,
  ChartTitleKeysEnum,
} from '@/lib/ChartTitles/chartTitleEnums';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';

mockHighChartsWrapperSetup();

const mockPath = 'some-mock-path';
mockUsePathname.mockReturnValue(mockPath);
mockSetIsLoading.mockReturnValue(true);

const lineChartTestId = 'standardLineChart-component';
const lineChartTableTestId = 'lineChartTable-component';
const lineChartContainerTestId = 'tabContainer-lineChartAndTable';
const lineChartContainerTitle =
  chartTitleConfig[ChartTitleKeysEnum.LineChart].title;
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
      indicatorSegments: [
        mockIndicatorSegment({
          healthData: mockHealthDataPoints([2023, 2022]),
        }),
      ],
    }),
    mockHealthDataForArea({
      areaCode: 'E12000006',
      areaName: 'Area2',
      indicatorSegments: [
        mockIndicatorSegment({
          healthData: mockHealthDataPoints([2023, 2022]),
        }),
      ],
    }),
    mockHealthDataForArea_England(),
  ],
});

const mockSearch = 'test';
const mockAreas = ['E12000004', 'E12000006'];
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
        mockIndicatorWithHealthDataForArea({
          areaHealthData: [
            mockHealthDataForArea(),
            mockHealthDataForArea({ areaCode: areaCodeForEngland }),
          ],
        }),
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
        await screen.findByRole('heading', {
          name: chartTitleConfig[ChartTitleKeysEnum.BarChartEmbeddedTable]
            .title,
        })
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
          await screen.findAllByText(
            chartTitleConfig[ChartTitleKeysEnum.ThematicMap].title
          )
        ).toHaveLength(2);
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

  describe('SingleIndicatorHeatMap', () => {
    const mockSearchStateAllAreas = {
      [SearchParams.IndicatorsSelected]: [testMetaData.indicatorID],
      [SearchParams.GroupAreaSelected]: ALL_AREAS_SELECTED,
      [SearchParams.GroupSelected]: 'E12000003',
      [SearchParams.AreaTypeSelected]: 'regions',
    };

    it('should render the SingleIndicatorHeatMap with title', async () => {
      await testRender(mockSearchStateAllAreas, testHealthData, testMetaData);
      expect(
        screen.getByTestId(`${ChartTitleKeysEnum.Heatmap}-component`)
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          chartTitleConfig[ChartTitleKeysEnum.SingleIndicatorHeatmap].title
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          chartTitleConfig[ChartTitleKeysEnum.SingleIndicatorHeatmap]
            .subTitle ?? ''
        )
      ).toBeInTheDocument();
    });
  });

  it('should render the available chart links when not all areas are selected', async () => {
    await testRender(mockSearchState, testHealthData, testMetaData);

    const availableChartLinks = screen.getByTestId(
      'availableChartLinks-component'
    );
    expect(availableChartLinks).toBeInTheDocument();

    const links = within(availableChartLinks).getAllByRole('link');

    expect(links[0]).toHaveTextContent(
      chartTitleConfig[ChartTitleKeysEnum.SingleIndicatorHeatmap].title
    );
    expect(links[1]).toHaveTextContent(
      chartTitleConfig[ChartTitleKeysEnum.LineChart].title
    );
    expect(links[2]).toHaveTextContent(
      chartTitleConfig[ChartTitleKeysEnum.BarChartEmbeddedTable].title
    );
    expect(links[3]).toHaveTextContent(
      chartTitleConfig[ChartTitleKeysEnum.PopulationPyramid].title
    );
  });

  it('should render the Thematic Map link when all areas are selected', async () => {
    const mockSearchStateAllAreas = {
      [SearchParams.IndicatorsSelected]: [testMetaData.indicatorID],
      [SearchParams.GroupAreaSelected]: ALL_AREAS_SELECTED,
      [SearchParams.GroupSelected]: 'E12000003',
      [SearchParams.AreaTypeSelected]: 'regions',
    };

    await testRender(mockSearchStateAllAreas, testHealthData, testMetaData);
    const availableChartLinks = screen.getByTestId(
      'availableChartLinks-component'
    );
    expect(availableChartLinks).toBeInTheDocument();

    const links = within(availableChartLinks).getAllByRole('link');
    expect(links[0]).toHaveTextContent(
      chartTitleConfig[ChartTitleKeysEnum.ThematicMap].title
    );
    expect(links[1]).toHaveTextContent(
      chartTitleConfig[ChartTitleKeysEnum.BarChartEmbeddedTable].title
    );
    expect(links[2]).toHaveTextContent(
      chartTitleConfig[ChartTitleKeysEnum.PopulationPyramid].title
    );
  });

  it('should not render the line chart link when there is no data available', async () => {
    const mockSearchStateNoAreas = {
      [SearchParams.IndicatorsSelected]: ['indicator-id'],
      [SearchParams.GroupAreaSelected]: undefined,
      [SearchParams.GroupSelected]: 'E12000003',
      [SearchParams.AreaTypeSelected]: 'regions',
    };

    await testRender(mockSearchStateNoAreas, { areaHealthData: [] }, undefined);

    expect(
      screen.queryByRole('link', {
        name: chartTitleConfig[ChartTitleKeysEnum.LineChart].title,
      })
    ).not.toBeInTheDocument();
  });
});
