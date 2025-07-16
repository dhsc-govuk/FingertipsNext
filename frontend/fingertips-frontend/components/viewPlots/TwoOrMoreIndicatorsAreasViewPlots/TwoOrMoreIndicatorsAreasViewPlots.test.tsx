// MUST BE AT THE TOP DUE TO HOISTING OF MOCKED MODULES
import { mockUseSearchStateParams } from '@/mock/utils/mockUseSearchStateParams';
import { mockUsePathname } from '@/mock/utils/mockNextNavigation';
import { mockSetIsLoading } from '@/mock/utils/mockUseLoadingState';
import { mockUseApiGetHealthDataForMultipleIndicatorsSetup } from '@/mock/utils/mockUseApiGetHealthDataForMultipleIndicators';
import { mockUseApiGetIndicatorMetaDatasSetup } from '@/mock/utils/mockUseApiGetIndicatorMetaDatas';
import { mockUseApiAvailableAreasSetup } from '@/mock/utils/mockUseApiAvailableAreas';
//
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { TwoOrMoreIndicatorsAreasViewPlot } from '.';
import { IndicatorWithHealthDataForArea } from '@/generated-sources/ft-api-client';
import { render, screen, within } from '@testing-library/react';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';
import {
  mockHealthDataForArea,
  mockHealthDataForArea_England,
  mockHealthDataForArea_Group,
} from '@/mock/data/mockHealthDataForArea';
import { mockIndicatorDocument } from '@/mock/data/mockIndicatorDocument';
import { mockQuartileData } from '@/mock/data/mockQuartileData';
import { mockIndicatorWithHealthDataForArea } from '@/mock/data/mockIndicatorWithHealthDataForArea';
import { extractHeatmapIndicatorData } from '@/components/charts/HeatMap';
import {
  chartTitleConfig,
  ChartTitleKeysEnum,
} from '@/lib/ChartTitles/chartTitleEnums';

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

mockUseApiAvailableAreasSetup();

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

mockUseApiGetHealthDataForMultipleIndicatorsSetup(mockIndicatorData);

mockUseApiGetIndicatorMetaDatasSetup(mockMetaData);

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

  it('should render the benchmark select area drop down for the view', () => {
    render(
      <TwoOrMoreIndicatorsAreasViewPlot indicatorData={mockIndicatorData} />
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
    mockSearchParams[SearchParams.AreasSelected] = [mockAreas[0], mockAreas[1]];
    render(
      <TwoOrMoreIndicatorsAreasViewPlot indicatorData={mockIndicatorData} />
    );

    expect(screen.getByTestId('heatmapChart-component')).toBeInTheDocument();
    expect(screen.getByTestId('spineChartTable-component')).toBeInTheDocument();
  });

  it('should render the heatmap but not the spine chart when all areas in a group are selected', () => {
    mockSearchParams[SearchParams.AreasSelected] = undefined;
    mockSearchParams[SearchParams.GroupAreaSelected] = ALL_AREAS_SELECTED;

    render(
      <TwoOrMoreIndicatorsAreasViewPlot indicatorData={mockIndicatorData} />
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
      <TwoOrMoreIndicatorsAreasViewPlot indicatorData={mockIndicatorData} />
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
      <TwoOrMoreIndicatorsAreasViewPlot indicatorData={mockIndicatorData} />
    );

    expect(screen.getByTestId('heatmapChart-component')).toBeInTheDocument();
    expect(
      screen.queryByTestId('spineChartTable-component')
    ).not.toBeInTheDocument();
  });

  it('should render the heatmap title', () => {
    render(
      <TwoOrMoreIndicatorsAreasViewPlot indicatorData={mockIndicatorData} />
    );

    expect(
      screen.getByRole('heading', {
        name: chartTitleConfig[ChartTitleKeysEnum.Heatmap].title,
      })
    ).toBeInTheDocument();
  });

  it('should render the heat map and population pyramid links when two areas have been selected', () => {
    render(
      <TwoOrMoreIndicatorsAreasViewPlot
        indicatorData={mockIndicatorData}
        indicatorMetadata={mockMetaData}
        benchmarkStatistics={mockQuartiles}
      />
    );

    const availableChartLinks = screen.getByTestId(
      'availableChartLinks-component'
    );
    expect(availableChartLinks).toBeInTheDocument();

    const chartLinks = within(availableChartLinks).getAllByRole('link');

    expect(chartLinks[0]).toHaveTextContent(
      chartTitleConfig[ChartTitleKeysEnum.Heatmap].title
    );
    expect(chartLinks[1]).toHaveTextContent(
      chartTitleConfig[ChartTitleKeysEnum.PopulationPyramid].title
    );
  });
});
