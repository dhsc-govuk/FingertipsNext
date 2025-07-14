import { render, screen } from '@testing-library/react';
import { CompareAreasTable } from '@/components/charts/CompareAreasTable/CompareAreasTable';
import {
  mockHealthDataForArea,
  mockHealthDataForArea_England,
} from '@/mock/data/mockHealthDataForArea';
import {
  BenchmarkComparisonMethod,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import { mockIndicatorDocument } from '@/mock/data/mockIndicatorDocument';
import { useCompareAreasTableData } from '@/components/charts/CompareAreasTable/hooks/useCompareAreasTableData';
import { MockedFunction } from 'vitest';

vi.mock(
  '@/components/charts/CompareAreasTable/BarChartEmbeddedTable/BarChartEmbeddedTable',
  () => ({
    BarChartEmbeddedTable: () => (
      <div data-testid="barChartEmbeddedTable-component" />
    ),
  })
);

vi.mock('@/components/charts/CompareAreasTable/hooks/useCompareAreasTableData');
const mockUseCompareAreasTableData = useCompareAreasTableData as MockedFunction<
  typeof useCompareAreasTableData
>;

describe('CompareAreasTable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when hook returns null', () => {
    mockUseCompareAreasTableData.mockReturnValue(null);
    const { container } = render(<CompareAreasTable />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the table when data is returned from hook', () => {
    mockUseCompareAreasTableData.mockReturnValue({
      benchmarkToUse: 'national',
      healthIndicatorData: [mockHealthDataForArea()],
      groupData: mockHealthDataForArea({ areaCode: 'g1', areaName: 'G' }),
      englandData: mockHealthDataForArea_England(),
      benchmarkComparisonMethod:
        BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
      polarity: IndicatorPolarity.HighIsGood,
      indicatorMetaData: mockIndicatorDocument(),
    });

    render(<CompareAreasTable />);

    expect(
      screen.getByRole('heading', { name: /Compare areas for one time period/ })
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('barChartEmbeddedTable-component')
    ).toBeInTheDocument();
  });
});
