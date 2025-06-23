import { render, screen } from '@testing-library/react';
import { LineChartTableOverTime } from '@/components/charts/LineChartOverTime/LineChartTableOverTime';
import { useLineChartOverTimeData } from '@/components/charts/LineChartOverTime/hooks/useLineChartOverTimeData';
import {
  BenchmarkComparisonMethod,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import { mockIndicatorDocument } from '@/mock/data/mockIndicatorDocument';
import {
  mockHealthDataForArea,
  mockHealthDataForArea_England,
} from '@/mock/data/mockHealthDataForArea';
import { LineChartTable } from '@/components/organisms/LineChartTable';
import { ComponentProps } from 'react';

jest.mock(
  '@/components/charts/LineChartOverTime/hooks/useLineChartOverTimeData'
);
jest.mock('@/components/organisms/LineChartTable', () => ({
  LineChartTable: (props: ComponentProps<typeof LineChartTable>) => (
    <div data-testid="mock-line-chart-table">
      <div data-testid="title">{props.title}</div>
      <div data-testid="polarity">{props.polarity}</div>
    </div>
  ),
}));

const mockUseLineChartOverTimeData =
  useLineChartOverTimeData as jest.MockedFunction<
    typeof useLineChartOverTimeData
  >;

describe('LineChartTableOverTime', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns null if lineChartOverTimeData is null', () => {
    mockUseLineChartOverTimeData.mockReturnValue(null);
    const { container } = render(<LineChartTableOverTime />);
    expect(container.firstChild).toBeNull();
  });

  it('renders LineChartTable with expected props', () => {
    mockUseLineChartOverTimeData.mockReturnValue({
      chartOptions: { title: { text: 'Test Chart Title' } },
      areaData: [mockHealthDataForArea()],
      englandData: mockHealthDataForArea_England(),
      groupData: mockHealthDataForArea({ areaCode: 'G1' }),
      indicatorMetaData: mockIndicatorDocument(),
      polarity: IndicatorPolarity.HighIsGood,
      benchmarkComparisonMethod: BenchmarkComparisonMethod.Quintiles,
      benchmarkToUse: 'England',
    });

    render(<LineChartTableOverTime />);

    expect(screen.getByTestId('mock-line-chart-table')).toBeInTheDocument();
    expect(screen.getByTestId('title')).toHaveTextContent('Test Chart Title');
    expect(screen.getByTestId('polarity')).toHaveTextContent(
      IndicatorPolarity.HighIsGood
    );
  });

  it('renders with empty title if chartOptions.title is missing', () => {
    mockUseLineChartOverTimeData.mockReturnValue({
      chartOptions: {},
      areaData: [],
      englandData: undefined,
      groupData: undefined,
      indicatorMetaData: mockIndicatorDocument(),
      polarity: IndicatorPolarity.HighIsGood,
      benchmarkComparisonMethod:
        BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
      benchmarkToUse: 'None',
    });

    render(<LineChartTableOverTime />);
    expect(screen.getByTestId('title')).toHaveTextContent('');
  });
});
