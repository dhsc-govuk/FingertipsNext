// MUST BE AT THE TOP DUE TO HOISTING OF MOCKED MODULES
import { mockUsePathname } from '@/mock/utils/mockNextNavigation';
import { mockSetIsLoading } from '@/mock/utils/mockUseLoadingState';
//
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { OneIndicatorTwoOrMoreAreasViewPlots } from '.';
import { act, render, screen, waitFor, within } from '@testing-library/react';
import { IndicatorWithHealthDataForArea } from '@/generated-sources/ft-api-client';
import regionsMap from '@/components/organisms/ThematicMap/regions.json';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';
import { QueryClientProvider } from '@tanstack/react-query';
import { mockIndicatorDocument } from '@/mock/data/mockIndicatorDocument';
import { mockIndicatorWithHealthDataForArea } from '@/mock/data/mockIndicatorWithHealthDataForArea';
import { mockHealthDataForArea } from '@/mock/data/mockHealthDataForArea';
import { mockHealthDataPointsNew } from '@/mock/data/mockHealthDataPoint';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { QueryClient } from '@tanstack/query-core';
import { oneIndicatorRequestParams } from '@/components/charts/helpers/oneIndicatorRequestParams';
import {
  EndPoints,
  queryKeyFromRequestParams,
} from '@/components/charts/helpers/queryKeyFromRequestParams';
import { mockIndicatorSegment } from '@/mock/data/mockIndicatorSegment';

const mockPath = 'some-mock-path';
mockUsePathname.mockReturnValue(mockPath);
mockSetIsLoading(false);

const lineChartTestId = 'standardLineChart-component';
const lineChartTableTestId = 'lineChartTable-component';
const lineChartContainerTestId = 'tabContainer-lineChartAndTable';
const lineChartContainerTitle = 'Indicator data over time';
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
const mockUseSearchStateParams = vi.fn();
vi.mock('@/components/hooks/useSearchStateParams', () => ({
  useSearchStateParams: () => mockUseSearchStateParams(),
}));

const testRender = async (
  searchState: SearchStateParams,
  healthData: IndicatorWithHealthDataForArea,
  indicatorMetadata?: IndicatorDocument
) => {
  mockUseSearchStateParams.mockReturnValue(searchState);
  const client = new QueryClient();

  // seed line chart over time data
  const lineChartApiParams = oneIndicatorRequestParams(searchState, []);
  const lineChartQueryKey = queryKeyFromRequestParams(
    EndPoints.HealthDataForAnIndicator,
    lineChartApiParams
  );
  client.setQueryData([lineChartQueryKey], healthData);

  // seed indicatorMetadata
  if (indicatorMetadata) {
    client.setQueryData(
      [`/indicator/${indicatorMetadata.indicatorID}`],
      indicatorMetadata
    );
  }

  // seed geoJson for regions map
  client.setQueryData(['map-geo-json/regions'], regionsMap);

  let areaCodes = undefined;
  if (searchState[SearchParams.GroupAreaSelected] === ALL_AREAS_SELECTED) {
    areaCodes = healthData.areaHealthData?.map((area) => area.areaCode);
  }

  await act(() =>
    render(
      <QueryClientProvider client={client}>
        <OneIndicatorTwoOrMoreAreasViewPlots
          indicatorData={healthData}
          indicatorMetadata={indicatorMetadata}
          areaCodes={areaCodes}
        />
      </QueryClientProvider>
    )
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
        name: 'Select a benchmark',
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
        await screen.findByText('Compare an indicator by areas')
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
        // The compare areas table and thematic map use the same title
        expect(
          await screen.findAllByText('Compare an indicator by areas')
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
});
