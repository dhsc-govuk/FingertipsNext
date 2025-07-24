// MUST BE AT THE TOP DUE TO HOISTING OF MOCKED MODULES
import { mockUseApiGetHealthDataForAnIndicatorSetup } from '@/mock/utils/mockUseApiGetHealthDataForAnIndicator';
import { mockUseApiGetIndicatorMetaDataSetup } from '@/mock/utils/mockUseApiGetIndicatorMetaData';
import { mockUseApiAvailableAreasSetup } from '@/mock/utils/mockUseApiAvailableAreas';
import { mockUseSearchStateParams } from '@/mock/utils/mockUseSearchStateParams';
//
import { render, screen } from '@testing-library/react';
import { SingleIndicatorHeatMap } from './SingleIndicatorHeatMap';
import { mockIndicatorDocument } from '@/mock/data/mockIndicatorDocument';
import { mockIndicatorWithHealthDataForArea } from '@/mock/data/mockIndicatorWithHealthDataForArea';
import {
  mockHealthDataForArea,
  mockHealthDataForArea_England,
  mockHealthDataForArea_Group,
} from '@/mock/data/mockHealthDataForArea';
import { mockIndicatorSegment } from '@/mock/data/mockIndicatorSegment';
import { mockSexData } from '@/mock/data/mockSexData';
import { SearchParams } from '@/lib/searchStateManager';
import {
  chartTitleConfig,
  ChartTitleKeysEnum,
} from '@/lib/ChartTitles/chartTitleEnums';

const testSegments = [
  mockIndicatorSegment({ sex: mockSexData({ value: 'Persons' }) }),
  mockIndicatorSegment({
    sex: mockSexData({ value: 'Male', isAggregate: false }),
  }),
  mockIndicatorSegment({
    sex: mockSexData({ value: 'Female', isAggregate: false }),
  }),
];

const testHealthData = mockIndicatorWithHealthDataForArea({
  areaHealthData: [
    mockHealthDataForArea({
      indicatorSegments: testSegments,
    }),
    mockHealthDataForArea_Group({
      indicatorSegments: testSegments,
    }),
    mockHealthDataForArea_England({
      indicatorSegments: testSegments,
    }),
  ],
});

describe('SingleIndicatorHeatMap', () => {
  beforeEach(() => {
    mockUseSearchStateParams.mockReturnValue({
      [SearchParams.GroupTypeSelected]: 'regions',
      [SearchParams.GroupSelected]:
        testHealthData.areaHealthData?.at(1)?.areaCode,
    });
    mockUseApiAvailableAreasSetup();
    mockUseApiGetIndicatorMetaDataSetup(mockIndicatorDocument());
    mockUseApiGetHealthDataForAnIndicatorSetup(testHealthData);
  });

  it('should not render anything if healthData is not available', () => {
    mockUseApiGetHealthDataForAnIndicatorSetup(undefined);

    const { container } = render(<SingleIndicatorHeatMap />);

    expect(container.firstChild).toBeNull();
  });

  it('should not render anything if metaData is not available', () => {
    mockUseApiGetIndicatorMetaDataSetup(undefined);

    const { container } = render(<SingleIndicatorHeatMap />);

    expect(container.firstChild).toBeNull();
  });

  it('should render a row for each segment', () => {
    render(<SingleIndicatorHeatMap />);

    expect(
      screen.getByTestId(`${ChartTitleKeysEnum.Heatmap}-component`)
    ).toBeInTheDocument();

    const trs = screen.getAllByRole('row');
    const firstCellContents = trs.map((tr) => tr.firstChild?.textContent);
    expect(firstCellContents).toEqual([
      'Indicators',
      `${testHealthData.name} (Persons, All ages)`,
      `${testHealthData.name} (Male, All ages)`,
      `${testHealthData.name} (Female, All ages)`,
    ]);
  });

  it('should render the correct table headers in the first row', () => {
    render(<SingleIndicatorHeatMap />);

    const ths = screen.getAllByRole('columnheader');
    const thContent = ths.map((th) => th.textContent);
    expect(thContent).toEqual([
      'Indicators',
      'Period',
      'Value unit',
      'Benchmark: England',
      'Group: North West Region',
      'Derby',
    ]);
  });

  it('should render the title and subtitle for singleIndicatorHeatMap', () => {
    render(<SingleIndicatorHeatMap />);

    expect(
      screen.getByRole('heading', {
        level: 3,
        name: chartTitleConfig[ChartTitleKeysEnum.SingleIndicatorHeatmap].title,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        level: 4,
        name: chartTitleConfig[ChartTitleKeysEnum.SingleIndicatorHeatmap]
          .subTitle,
      })
    ).toBeInTheDocument();
  });
});
