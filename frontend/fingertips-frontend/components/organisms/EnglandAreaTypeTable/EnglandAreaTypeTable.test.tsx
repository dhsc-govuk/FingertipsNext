import { render, screen } from '@testing-library/react';
import {
  EnglandAreaTypeIndicatorData,
  EnglandAreaTypeTable,
} from '@/components/organisms/EnglandAreaTypeTable/index';
import {
  HealthDataForArea,
  HealthDataPointTrendEnum,
} from '@/generated-sources/ft-api-client';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { allAgesAge, noDeprivation, personsSex } from '@/lib/mocks';

const mockEnglandHealthData: HealthDataForArea = {
  areaCode: areaCodeForEngland,
  areaName: 'England',
  healthData: [
    {
      year: 2008,
      count: 222,
      value: 890.305692,
      lowerCi: 441.69151,
      upperCi: 578.32766,
      ageBand: allAgesAge,
      sex: personsSex,
      trend: HealthDataPointTrendEnum.NotYetCalculated,
      deprivation: noDeprivation,
    },
  ],
};

const mockNoHealthData: HealthDataForArea = {
  areaCode: areaCodeForEngland,
  areaName: 'England',
  healthData: [],
};

const mockIndicatorData: EnglandAreaTypeIndicatorData[] = [
  {
    indicatorId: 1,
    indicatorName: ' ',
    period: '2008',
    latestEnglandHealthData: mockEnglandHealthData.healthData[0],
    unitLabel: '',
  },
  {
    indicatorId: 2,
    indicatorName: 'no data indicator',
    period: '',
    latestEnglandHealthData: mockNoHealthData.healthData[0],
    unitLabel: '',
  },
];

describe('EnglandAreaTypeTable', () => {
  it('should render EnglandAreaTypeTable component', () => {
    render(<EnglandAreaTypeTable indicatorData={mockIndicatorData} />);
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(
      screen.getByTestId('englandAreaTypeTable-component')
    ).toBeInTheDocument();
  });

  it('should always display indicator name when no health data for the indicator is present', () => {
    render(<EnglandAreaTypeTable indicatorData={mockIndicatorData} />);

    expect(screen.getAllByRole('row')[3]).toHaveTextContent(
      'no data indicator'
    );
    expect(screen.getAllByRole('cell')[3]).toHaveTextContent('X');
  });

  it('should display X in the table cell if there is no value', () => {
    render(<EnglandAreaTypeTable indicatorData={mockIndicatorData} />);

    const noValueCells = screen.getAllByText('X');
    expect(noValueCells).toHaveLength(5);
  });

  it('should display the correct aria label when then is no value', () => {
    render(<EnglandAreaTypeTable indicatorData={mockIndicatorData} />);

    const noValueCells = screen.getAllByLabelText('Not compared');
    expect(noValueCells).toHaveLength(5);
  });

  it('should render the correct trend label for the data in the table', () => {
    render(<EnglandAreaTypeTable indicatorData={mockIndicatorData} />);

    const trendTags = screen.getAllByTestId('trend-tag-component');
    expect(trendTags).toHaveLength(2);
    expect(trendTags[0].textContent).toEqual('No trend data available');
    expect(trendTags[1].textContent).toEqual('No trend data available');
  });
});
