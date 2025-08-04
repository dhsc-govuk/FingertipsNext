// MUST BE AT THE TOP DUE TO HOISTING OF MOCKED MODULES
import { mockSetIsLoading } from '@/mock/utils/mockUseLoadingState';
import { mockUseSearchStateParams } from '@/mock/utils/mockUseSearchStateParams';
import { mockUsePathname } from '@/mock/utils/mockNextNavigation';
//
import { render, screen, fireEvent, within } from '@testing-library/react';
import { PeriodType, ReportingPeriod } from '@/generated-sources/ft-api-client';
import { AreaDocument } from '@/lib/search/searchTypes';
import { SearchStateParams } from '@/lib/searchStateManager';
import { PopulationPyramid } from '@/components/charts/PopulationPyramid/PopulationPyramid';
import {
  chartTitleConfig,
  ChartTitleKeysEnum,
} from '@/lib/ChartTitles/chartTitleEnums';
import { mockHealthDataForArea } from '@/mock/data/mockHealthDataForArea';
import { mockIndicatorSegment } from '@/mock/data/mockIndicatorSegment';
import { mockHealthDataPoint } from '@/mock/data/mockHealthDataPoint';
import { mockDatePeriod } from '@/mock/data/mockDatePeriod';

const mockSearchState: SearchStateParams = {};

mockUsePathname.mockReturnValue('some-path-name');
mockSetIsLoading.mockReturnValue(false);
mockUseSearchStateParams.mockReturnValue(mockSearchState);

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

const localMockHealthDataForArea = [
  mockHealthDataForArea({
    areaCode: '123',
    areaName: 'Test Area 123',
  }),
  mockHealthDataForArea({
    areaCode: '124',
    areaName: 'Test Area 124',
  }),
];

function testRender(dataForArea = localMockHealthDataForArea) {
  return render(
    <PopulationPyramid
      healthDataForAreas={dataForArea}
      xAxisTitle="Age"
      yAxisTitle="Percentage of population"
      indicatorId={'1'}
      indicatorName={'Indicator'}
    />
  );
}

describe('PopulationPyramidWithTable', () => {
  test('renders component with default title', () => {
    testRender();
    expect(
      screen.getByText(
        chartTitleConfig[ChartTitleKeysEnum.PopulationPyramid].title
      )
    ).toBeInTheDocument();
  });

  test('renders tabs correctly', () => {
    testRender();
    expect(screen.getByText('Show population data')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Show population data'));
    expect(screen.getByText('Hide population data')).toBeInTheDocument();
  });

  it('test that we can clicked the expander', async () => {
    testRender();
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
    testRender();

    fireEvent.click(screen.getByText('Show population data'));

    const populationAreasDropDown = screen.getByRole('combobox', {
      name: 'Select an area',
    });
    const populationAreasDropDownOptions = within(
      populationAreasDropDown
    ).getAllByRole('option');

    expect(populationAreasDropDown).toBeInTheDocument();
    expect(populationAreasDropDownOptions).toHaveLength(2);
    populationAreasDropDownOptions.forEach((option, i) => {
      expect(option.textContent).toBe(localMockHealthDataForArea[i].areaName);
    });
  });

  it('should not render if health data is empty', () => {
    testRender([]);
    expect(
      screen.queryByTestId('populationPyramidWithTable-component')
    ).not.toBeInTheDocument();
  });

  it('should show No "data" message if no data for the area', () => {
    const mockHealthDataForWithNoDatafForArea = [
      mockHealthDataForArea({
        indicatorSegments: [
          mockIndicatorSegment({
            healthData: [],
          }),
        ],
      }),
    ];

    testRender(mockHealthDataForWithNoDatafForArea);
    fireEvent.click(screen.getByText('Show population data'));

    expect(
      screen.queryByTestId('populationPyramidWithTable-component')
    ).toBeInTheDocument();
    expect(
      screen.getByText('No population data for this area')
    ).toBeInTheDocument();
  });
});
