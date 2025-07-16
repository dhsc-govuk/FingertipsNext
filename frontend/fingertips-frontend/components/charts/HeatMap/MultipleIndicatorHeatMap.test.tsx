// MUST BE AT THE TOP DUE TO HOISTING OF MOCKED MODULES
import { mockUseApiAvailableAreasSetup } from '@/mock/utils/mockUseApiAvailableAreas';
import { mockUseSearchStateParams } from '@/mock/utils/mockUseSearchStateParams';
import { mockUseApiGetHealthDataForMultipleIndicatorsSetup } from '@/mock/utils/mockUseApiGetHealthDataForMultipleIndicators';
import { mockUseApiGetIndicatorMetaDatasSetup } from '@/mock/utils/mockUseApiGetIndicatorMetaDatas';
//
import { render, screen } from '@testing-library/react';
import { mockIndicatorDocument } from '@/mock/data/mockIndicatorDocument';
import { mockIndicatorWithHealthDataForArea } from '@/mock/data/mockIndicatorWithHealthDataForArea';
import {
  mockHealthDataForArea,
  mockHealthDataForArea_England,
  mockHealthDataForArea_Group,
} from '@/mock/data/mockHealthDataForArea';
import { mockIndicatorSegment } from '@/mock/data/mockIndicatorSegment';
import { mockSexData } from '@/mock/data/mockSexData';
import { heatMapText } from '@/components/charts/HeatMap/heatmapConstants';

import { SearchParams } from '@/lib/searchStateManager';
import { MultipleIndicatorHeatMap } from '@/components/charts/HeatMap/MultipleIndicatorHeatMap';

const testIndicatorOne = mockIndicatorDocument({
  indicatorID: '1',
  indicatorName: 'One',
});
const testIndicatorTwo = mockIndicatorDocument({
  indicatorID: '2',
  indicatorName: 'Two',
});

const testIndicators = [testIndicatorOne, testIndicatorTwo];

const testSegments = [
  mockIndicatorSegment({ sex: mockSexData({ value: 'Persons' }) }),
  mockIndicatorSegment({
    sex: mockSexData({ value: 'Male', isAggregate: false }),
  }),
  mockIndicatorSegment({
    sex: mockSexData({ value: 'Female', isAggregate: false }),
  }),
];

const testAreaData = [
  mockHealthDataForArea({
    indicatorSegments: testSegments,
  }),
  mockHealthDataForArea_Group({
    indicatorSegments: testSegments,
  }),
  mockHealthDataForArea_England({
    indicatorSegments: testSegments,
  }),
];

const testHealthData = [
  mockIndicatorWithHealthDataForArea({
    indicatorId: 1,
    name: 'One',
    areaHealthData: testAreaData,
  }),
  mockIndicatorWithHealthDataForArea({
    indicatorId: 2,
    name: 'Two',
    areaHealthData: testAreaData,
  }),
];

describe('MultipleIndicatorHeatMap', () => {
  beforeEach(() => {
    mockUseSearchStateParams.mockReturnValue({
      [SearchParams.GroupTypeSelected]: 'regions',
      [SearchParams.GroupSelected]: testHealthData?.at(0)?.areaHealthData?.at(1)
        ?.areaCode,
    });
    mockUseApiAvailableAreasSetup();
    mockUseApiGetIndicatorMetaDatasSetup(testIndicators);
    mockUseApiGetHealthDataForMultipleIndicatorsSetup(testHealthData);
  });

  it('should render a row for each segment', () => {
    render(<MultipleIndicatorHeatMap />);

    expect(screen.getByTestId('heatmapChart-component')).toBeInTheDocument();

    const trs = screen.getAllByRole('row');
    const firstCellContents = trs.map((tr) => tr.firstChild?.textContent);
    expect(firstCellContents).toEqual([
      'Indicators',
      `${testIndicatorOne.indicatorName} (Persons)`,
      `${testIndicatorOne.indicatorName} (Male)`,
      `${testIndicatorOne.indicatorName} (Female)`,
      `${testIndicatorTwo.indicatorName} (Persons)`,
      `${testIndicatorTwo.indicatorName} (Male)`,
      `${testIndicatorTwo.indicatorName} (Female)`,
    ]);
  });

  it('should render the correct table headers in the first row', () => {
    render(<MultipleIndicatorHeatMap />);

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

  it('should render the title and subtitle for MultipleIndicatorHeatMap', () => {
    render(<MultipleIndicatorHeatMap />);

    expect(
      screen.getByRole('heading', {
        level: 3,
        name: heatMapText.multipleIndicator.title,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        level: 4,
        name: heatMapText.multipleIndicator.subTitle,
      })
    ).toBeInTheDocument();
  });
});
