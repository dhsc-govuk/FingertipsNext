// MUST BE AT THE TOP DUE TO HOISTING OF MOCKED MODULES
import { mockSetIsLoading } from '@/mock/utils/mockUseLoadingState';
import { mockUseSearchStateParams } from '@/mock/utils/mockUseSearchStateParams';
import { mockUsePathname } from '@/mock/utils/mockNextNavigation';
//
import { render, screen, fireEvent, within } from '@testing-library/react';
import {
  HealthDataForArea,
  HealthDataPoint,
  HealthDataPointTrendEnum,
} from '@/generated-sources/ft-api-client';
import { mockHealthData } from '@/mock/data/healthdata';
import { AreaDocument } from '@/lib/search/searchTypes';
import { disaggregatedAge, femaleSex, noDeprivation } from '@/lib/mocks';
import { SearchStateParams } from '@/lib/searchStateManager';
import { PopulationPyramid } from '@/components/charts/PopulationPyramid/PopulationPyramid';
import {
  chartTitleConfig,
  ChartTitleKeysEnum,
} from '@/lib/ChartTitles/chartTitleEnums';

const mockSearchState: SearchStateParams = {};

mockUsePathname.mockReturnValue('some-path-name');
mockSetIsLoading.mockReturnValue(false);
mockUseSearchStateParams.mockReturnValue(mockSearchState);

const mockHealthDataPoint: HealthDataPoint[] = [
  {
    year: 2025,
    count: 200,
    value: 0,
    lowerCi: 0,
    upperCi: 0,
    ageBand: disaggregatedAge('0-4'),
    sex: femaleSex,
    trend: HealthDataPointTrendEnum.NotYetCalculated,
    deprivation: noDeprivation,
  },
  {
    year: 2023,
    count: 200,
    value: 0,
    lowerCi: 0,
    upperCi: 0,
    ageBand: disaggregatedAge('5-9'),
    sex: femaleSex,
    trend: HealthDataPointTrendEnum.NotYetCalculated,
    deprivation: noDeprivation,
  },
];

// Mock dependencies
vi.mock(
  '@/components/charts/PopulationPyramid/PopulationPyramidChart/PopulationPyramidChart',
  () => ({
    PopulationPyramidChart: () => <div data-testid="population-pyramid"></div>,
  })
);
vi.mock('@/components/molecules/SelectInputField', () => ({
  AreaSelectInputField: ({
    onSelected,
  }: {
    onSelected: (area: Omit<AreaDocument, 'areaType'>) => void;
  }) => (
    <button
      data-testid="select-input"
      onClick={() => onSelected({ areaCode: '123', areaName: 'Test Area' })}
    >
      Select Area
    </button>
  ),
}));

describe('PopulationPyramidWithTable', () => {
  const setupUI = (dataForArea: HealthDataForArea[]) => {
    return render(
      <PopulationPyramid
        healthDataForAreas={dataForArea}
        xAxisTitle="Age"
        yAxisTitle="Percentage of population"
        indicatorId={'1'}
        indicatorName={'Indicator'}
      />
    );
  };
  const mockHealthDataForArea: HealthDataForArea[] = [
    {
      areaCode: '123',
      areaName: 'Test Area 123',
      healthData: mockHealthDataPoint,
    },
    {
      areaCode: '124',
      areaName: 'Test Area 124',
      healthData: mockHealthDataPoint,
    },
  ];

  test('renders component with default title', () => {
    setupUI(mockHealthDataForArea);
    expect(
      screen.getByText(
        chartTitleConfig[ChartTitleKeysEnum.PopulationPyramid].title
      )
    ).toBeInTheDocument();
  });

  test('renders tabs correctly', () => {
    const container = setupUI(mockHealthDataForArea);
    expect(screen.getByText('Show population data')).toBeInTheDocument();

    fireEvent.click(container.getByText('Show population data'));
    expect(screen.getByText('Hide population data')).toBeInTheDocument();
  });

  it('test that we can clicked the expander', async () => {
    setupUI(mockHealthDataForArea);
    const populationPyramid = screen.getByTestId(
      'populationPyramidWithTable-component'
    );
    const expander = await within(populationPyramid).findByText(
      'Show population data'
    );
    fireEvent.click(expander);
    expect(screen.getByText('Hide population data')).toBeInTheDocument();
  });

  it('should render the availableAreas as options in the Select an area dropdown', async () => {
    const container = setupUI(mockHealthDataForArea);

    fireEvent.click(container.getByText('Show population data'));

    const populationAreasDropDown = screen.getByRole('combobox', {
      name: 'Select an area',
    });
    const populationAreasDropDownOptions = within(
      populationAreasDropDown
    ).getAllByRole('option');

    expect(populationAreasDropDown).toBeInTheDocument();
    expect(populationAreasDropDownOptions).toHaveLength(2);
    populationAreasDropDownOptions.forEach((option, i) => {
      expect(option.textContent).toBe(mockHealthDataForArea[i].areaName);
    });
  });

  test('take a snapshot', () => {
    const container = render(
      <PopulationPyramid
        healthDataForAreas={mockHealthData['337']}
        xAxisTitle="Age"
        yAxisTitle="Percentage of population"
        indicatorId={'1'}
        indicatorName={'Indicator'}
      />
    );
    expect(container.asFragment()).toMatchSnapshot();
  });
});
