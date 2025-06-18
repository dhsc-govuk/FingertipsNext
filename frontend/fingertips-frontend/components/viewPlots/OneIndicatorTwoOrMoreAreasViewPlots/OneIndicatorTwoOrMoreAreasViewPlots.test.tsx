import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { OneIndicatorTwoOrMoreAreasViewPlots } from '.';
import { act, render, screen, waitFor, within } from '@testing-library/react';
import { mockHealthData } from '@/mock/data/healthdata';
import { IndicatorWithHealthDataForArea } from '@/generated-sources/ft-api-client';
import regionsMap from '@/components/organisms/ThematicMap/regions.json';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';
import { SearchStateContext } from '@/context/SearchStateContext';
import { reactQueryClient } from '@/lib/reactQueryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { LoaderContext } from '@/context/LoaderContext';
import { mockIndicatorDocument } from '@/mock/data/mockIndicatorDocument';

const mockPath = 'some-mock-path';
const mockReplace = vi.fn();
vi.mock('next/navigation', async () => {
  const originalModule = await vi.importActual('next/navigation');

  return {
    ...originalModule,
    usePathname: () => mockPath,
    useSearchParams: () => {},
    useRouter: vi.fn().mockImplementation(() => ({
      replace: mockReplace,
    })),
  };
});

const mockLoaderContext: LoaderContext = {
  getIsLoading: vi.fn(),
  setIsLoading: vi.fn(),
};
vi.mock('@/context/LoaderContext', () => {
  return {
    useLoadingState: () => mockLoaderContext,
  };
});

const mockGetSearchState = vi.fn();
const mockSearchStateContext: SearchStateContext = {
  getSearchState: mockGetSearchState,
  setSearchState: vi.fn(),
};
vi.mock('@/context/SearchStateContext', () => {
  return {
    useSearchState: () => mockSearchStateContext,
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
  unitLabel: 'pancakes',
  hasInequalities: true,
};

const mockSearch = 'test';
const mockIndicator = ['108'];
const mockAreas = ['E12000001', 'E12000003'];
const testHealthData: IndicatorWithHealthDataForArea = {
  areaHealthData: [mockHealthData['108'][1], mockHealthData['108'][2]],
};

const mockSearchState: SearchStateParams = {};
vi.mock('@/components/hooks/useSearchStateParams', () => ({
  useSearchStateParams: () => mockSearchState,
}));

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
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchState[SearchParams.SearchedIndicator] = mockSearch;
    mockSearchState[SearchParams.IndicatorsSelected] = mockIndicator;
    mockSearchState[SearchParams.AreasSelected] = mockAreas;
  });

  afterAll(() => {
    vi.resetAllMocks();
  });

  it('should render the benchmark select area drop down for the view', async () => {
    await act(() =>
      render(
        <OneIndicatorTwoOrMoreAreasViewPlots
          indicatorData={testHealthData}
          indicatorMetadata={mockMetaData}
        />
      )
    );

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
      render(
        <OneIndicatorTwoOrMoreAreasViewPlots
          indicatorData={testHealthData}
          indicatorMetadata={mockMetaData}
        />
      );
      await assertLineChartAndTableInDocument();
    });

    it('should display data source in the LineChart when metadata exists', async () => {
      render(
        <OneIndicatorTwoOrMoreAreasViewPlots
          indicatorData={testHealthData}
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

      mockSearchState[SearchParams.SearchedIndicator] = undefined;

      render(<OneIndicatorTwoOrMoreAreasViewPlots indicatorData={MOCK_DATA} />);

      await waitFor(() => assertLineChartAndTableNotInDocument());
    });

    it('should not render the LineChart components when there are more than 2 areas', async () => {
      mockSearchState[SearchParams.AreasSelected] = [...mockAreas, 'A003'];

      render(
        <OneIndicatorTwoOrMoreAreasViewPlots
          indicatorData={testHealthData}
          indicatorMetadata={mockMetaData}
        />
      );

      await waitFor(() => assertLineChartAndTableNotInDocument());
    });
  });

  describe('BarChartEmbeddedTable', () => {
    it('should render the BarChartEmbeddedTable component, when two or more areas are selected', async () => {
      mockSearchState[SearchParams.AreasSelected] = ['A1245', 'A1246', 'A1427'];

      render(
        <OneIndicatorTwoOrMoreAreasViewPlots indicatorData={testHealthData} />
      );

      expect(
        await screen.findByTestId(barChartEmbeddedTable)
      ).toBeInTheDocument();
    });

    it('should render the title for BarChartEmbeddedTable', async () => {
      mockSearchState[SearchParams.AreasSelected] = ['A1245', 'A1246', 'A1427'];
      render(
        <OneIndicatorTwoOrMoreAreasViewPlots indicatorData={testHealthData} />
      );

      expect(
        await screen.findByText('Compare an indicator by areas')
      ).toBeInTheDocument();
    });
  });

  describe('ThematicMap', () => {
    beforeEach(() => {
      global.fetch = vi.fn();
      mockGetSearchState.mockReturnValue({
        [SearchParams.AreaTypeSelected]: 'regions',
      });

      mockSearchState[SearchParams.SearchedIndicator] = mockSearch;
      mockSearchState[SearchParams.IndicatorsSelected] = mockIndicator;
      mockSearchState[SearchParams.AreasSelected] = mockAreas;
      mockSearchState[SearchParams.GroupAreaSelected] = ALL_AREAS_SELECTED;
      mockSearchState[SearchParams.AreaTypeSelected] = 'regions';
      mockSearchState[SearchParams.GroupSelected] = 'E12000003';
    });

    it('should render the ThematicMap with title', async () => {
      (fetch as vi.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => regionsMap,
      });

      render(
        <QueryClientProvider client={reactQueryClient}>
          <OneIndicatorTwoOrMoreAreasViewPlots
            indicatorData={{
              areaHealthData: [
                mockHealthData[108][1],
                mockHealthData[108][2],
                mockHealthData[108][3],
              ],
            }}
            areaCodes={['E12000001', 'E12000002']}
            indicatorMetadata={mockIndicatorDocument()}
          />
        </QueryClientProvider>
      );

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
      mockSearchState[SearchParams.GroupAreaSelected] = 'not_all';

      render(
        <OneIndicatorTwoOrMoreAreasViewPlots
          indicatorData={{
            areaHealthData: [
              mockHealthData[108][1],
              mockHealthData[108][2],
              mockHealthData[108][3],
            ],
          }}
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
