// MUST BE AT THE TOP DUE TO HOISTING OF MOCKED MODULES
import { mockUseSearchStateParams } from '@/mock/utils/mockUseSearchStateParams';
import { mockUsePathname } from '@/mock/utils/mockNextNavigation';
import { mockSetIsLoading } from '@/mock/utils/mockUseLoadingState';
//
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import {
  extractHeatmapIndicatorData,
  TwoOrMoreIndicatorsAreasViewPlot,
} from '.';
import {
  BenchmarkComparisonMethod,
  IndicatorPolarity,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import { render, screen, within } from '@testing-library/react';
import { HeatmapIndicatorData } from '@/components/organisms/Heatmap/heatmapTypes';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';
import {
  mockHealthDataForArea,
  mockHealthDataForArea_England,
  mockHealthDataForArea_Group,
} from '@/mock/data/mockHealthDataForArea';
import { mockIndicatorDocument } from '@/mock/data/mockIndicatorDocument';
import { mockQuartileData } from '@/mock/data/mockQuartileData';
import { mockIndicatorWithHealthDataForArea } from '@/mock/data/mockIndicatorWithHealthDataForArea';

mockUsePathname.mockReturnValue('some-mock-pathname');
mockSetIsLoading(false);

vi.mock('@/components/charts/SpineChart/SpineChartWrapper', () => ({
  SpineChartWrapper: () => <div data-testid="spineChartTable-component" />,
}));

const indicatorIds = ['123', '321'];
const mockAreas = ['A001', 'A002', 'A003'];
const mockGroupArea = 'G001';

let mockSearchParams: SearchStateParams;
mockUseSearchStateParams.mockImplementation(() => mockSearchParams);

const mockHealthArea1 = mockHealthDataForArea({
  areaCode: mockAreas[0],
  areaName: 'Area1',
});
const mockHealthArea2 = mockHealthDataForArea({
  areaCode: mockAreas[1],
  areaName: 'Area2',
});

const mockHealthArea3 = mockHealthDataForArea({
  areaCode: mockAreas[2],
  areaName: 'Area3',
});
const mockIndicatorData: IndicatorWithHealthDataForArea[] = [
  {
    indicatorId: Number(indicatorIds[0]),
    areaHealthData: [
      mockHealthArea1,
      mockHealthArea2,
      mockHealthDataForArea_Group({ areaCode: mockGroupArea }),
      mockHealthDataForArea_England(),
    ],
  },
  {
    indicatorId: Number(indicatorIds[1]),
    areaHealthData: [
      mockHealthArea2,
      mockHealthArea3,
      mockHealthDataForArea_Group(),
      mockHealthDataForArea_England(),
    ],
  },
];

const mockMeta1 = mockIndicatorDocument({ indicatorID: indicatorIds[0] });
const mockMeta2 = mockIndicatorDocument({ indicatorID: indicatorIds[1] });
const mockMetaData = [mockMeta1, mockMeta2];

const mockQuartiles = [
  mockQuartileData({ indicatorId: Number(indicatorIds[0]) }),
  mockQuartileData({ indicatorId: Number(indicatorIds[1]) }),
];

describe('TwoOrMoreIndicatorsAreasViewPlots', () => {
  beforeEach(() => {
    // Ensure defaults are not overwritten
    mockSearchParams = {
      [SearchParams.SearchedIndicator]: 'testing',
      [SearchParams.IndicatorsSelected]: indicatorIds,
      [SearchParams.AreasSelected]: mockAreas,
      [SearchParams.GroupSelected]: mockGroupArea,
      [SearchParams.GroupAreaSelected]: undefined,
    };
  });

  it('should render the benchmark select area drop down for the view', async () => {
    render(
      <TwoOrMoreIndicatorsAreasViewPlot
        indicatorData={mockIndicatorData}
        indicatorMetadata={mockMetaData}
        benchmarkStatistics={mockQuartiles}
      />
    );

    const benchmarkAreaDropDown = screen.getByRole('combobox', {
      name: 'Select a benchmark for all charts',
    });
    const benchmarkAreaDropDownOptions = within(
      benchmarkAreaDropDown
    ).getAllByRole('option');

    expect(benchmarkAreaDropDown).toBeInTheDocument();
    expect(benchmarkAreaDropDownOptions).toHaveLength(2);
    expect(benchmarkAreaDropDownOptions[0]).toHaveTextContent('England');
    expect(benchmarkAreaDropDownOptions[1]).toHaveTextContent(
      'North West Region'
    );
  });

  it('should render all components with up to 2 areas selected', () => {
    const areas = [mockAreas[0], mockAreas[1]];
    mockSearchParams[SearchParams.AreasSelected] = areas;
    render(
      <TwoOrMoreIndicatorsAreasViewPlot
        indicatorData={mockIndicatorData}
        indicatorMetadata={mockMetaData}
        benchmarkStatistics={mockQuartiles}
      />
    );

    expect(screen.getByTestId('heatmapChart-component')).toBeInTheDocument();
    expect(screen.getByTestId('spineChartTable-component')).toBeInTheDocument();
  });

  it('should render the heatmap but not the spine chart when all areas in a group are selected', () => {
    mockSearchParams[SearchParams.AreasSelected] = undefined;
    mockSearchParams[SearchParams.GroupAreaSelected] = ALL_AREAS_SELECTED;

    render(
      <TwoOrMoreIndicatorsAreasViewPlot
        indicatorData={mockIndicatorData}
        indicatorMetadata={mockMetaData}
        benchmarkStatistics={mockQuartiles}
      />
    );

    expect(screen.getByTestId('heatmapChart-component')).toBeInTheDocument();
    expect(
      screen.queryByTestId('spineChartTable-component')
    ).not.toBeInTheDocument();
  });

  it('should render all areas when all areas in a group are selected', () => {
    mockSearchParams[SearchParams.AreasSelected] = undefined;
    mockSearchParams[SearchParams.GroupAreaSelected] = ALL_AREAS_SELECTED;

    render(
      <TwoOrMoreIndicatorsAreasViewPlot
        indicatorData={mockIndicatorData}
        indicatorMetadata={mockMetaData}
        benchmarkStatistics={mockQuartiles}
      />
    );

    const heatmapTable = screen.getByTestId('heatmapChart-component');
    expect(within(heatmapTable).getByText('Area1')).toBeInTheDocument();
    expect(within(heatmapTable).getByText('Area2')).toBeInTheDocument();
    expect(within(heatmapTable).getByText('Area3')).toBeInTheDocument();
  });

  it('should not render the spine chart component with more than 2 areas selected', () => {
    const areas = [mockAreas[0], mockAreas[1], mockAreas[2]];
    mockSearchParams[SearchParams.AreasSelected] = areas;

    render(
      <TwoOrMoreIndicatorsAreasViewPlot
        indicatorData={mockIndicatorData}
        indicatorMetadata={mockMetaData}
        benchmarkStatistics={mockQuartiles}
      />
    );

    expect(screen.getByTestId('heatmapChart-component')).toBeInTheDocument();
    expect(
      screen.queryByTestId('spineChartTable-component')
    ).not.toBeInTheDocument();
  });

  it('should render the heatmap title', () => {
    render(
      <TwoOrMoreIndicatorsAreasViewPlot
        indicatorData={mockIndicatorData}
        indicatorMetadata={mockMetaData}
        benchmarkStatistics={mockQuartiles}
      />
    );

    expect(
      screen.getByRole('heading', { name: 'Overview of indicators and areas' })
    ).toBeInTheDocument();
  });
});

describe('extractHeatmapIndicatorData', () => {
  const populatedIndicatorData = mockIndicatorWithHealthDataForArea();
  const populatedIndicatorMetadata = mockIndicatorDocument();

  it('should populate heatmap indicator data with values from indicator data and metadata', () => {
    const expectedHeatmapIndicatorData: HeatmapIndicatorData = {
      indicatorId: populatedIndicatorMetadata.indicatorID,
      indicatorName: populatedIndicatorMetadata.indicatorName,
      healthDataForAreas: populatedIndicatorData.areaHealthData ?? [],
      unitLabel: populatedIndicatorMetadata.unitLabel,
      benchmarkComparisonMethod:
        populatedIndicatorData.benchmarkMethod ??
        BenchmarkComparisonMethod.Unknown,
      polarity: populatedIndicatorData.polarity ?? IndicatorPolarity.Unknown,
    };

    const heatmapData = extractHeatmapIndicatorData(
      populatedIndicatorData,
      populatedIndicatorMetadata
    );

    expect(heatmapData).toEqual(expectedHeatmapIndicatorData);
  });

  it('should return undefined if indicatorData.areaHealthData is undefined', () => {
    const heatmapData = extractHeatmapIndicatorData(
      { ...populatedIndicatorData, areaHealthData: undefined },
      populatedIndicatorMetadata
    );

    expect(heatmapData).toBe(undefined);
  });

  it('should default props if not defined in inputs', () => {
    const expectedHeatmapIndicatorData: HeatmapIndicatorData = {
      indicatorId: populatedIndicatorMetadata.indicatorID,
      indicatorName: populatedIndicatorMetadata.indicatorName,
      healthDataForAreas: populatedIndicatorData.areaHealthData ?? [],
      unitLabel: populatedIndicatorMetadata.unitLabel,
      benchmarkComparisonMethod: BenchmarkComparisonMethod.Unknown,
      polarity: IndicatorPolarity.Unknown,
    };

    const heatmapData = extractHeatmapIndicatorData(
      {
        ...populatedIndicatorData,
        benchmarkMethod: undefined,
        polarity: undefined,
      },
      populatedIndicatorMetadata
    );

    expect(heatmapData).toEqual(expectedHeatmapIndicatorData);
  });
});
