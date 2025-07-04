import React from 'react';
import { render, screen } from '@testing-library/react';
import { SpineChartLegend } from './SpineChartLegend';
import { BenchmarkLegendsToShow } from '@/components/organisms/BenchmarkLegend/benchmarkLegend.types';
import {
  areaCodeForEngland,
  englandAreaString,
} from '@/lib/chartHelpers/constants';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';

vi.mock('@/components/organisms/BenchmarkLegend', () => ({
  BenchmarkLegends: () => <div data-testid="benchmark-legends" />,
}));
vi.mock(
  '@/components/charts/SpineChart/SpineChart/SpineChartQuartilesInfo',
  () => ({
    SpineChartQuartilesInfoContainer: () => (
      <div data-testid="quartiles-info" />
    ),
  })
);
vi.mock('./SpineChartLegendItem', () => ({
  SpineChartLegendItem: ({
    children,
    itemType,
  }: React.PropsWithChildren<{ itemType: string }>) => (
    <div data-testid={`legend-item-${itemType}`}>{children}</div>
  ),
}));

let mockSearchState: SearchStateParams = {};
vi.mock('@/components/hooks/useSearchStateParams', () => ({
  useSearchStateParams: () => mockSearchState,
}));

const defaultProps = {
  legendsToShow: {} as BenchmarkLegendsToShow,
  benchmarkToUse: areaCodeForEngland,
  groupName: 'Test Group',
  areaNames: ['Area 1', 'Area 2'],
};

describe('SpineChartLegend', () => {
  it('renders the main benchmark legend for England', () => {
    render(<SpineChartLegend {...defaultProps} />);
    expect(
      screen.getByText(`Benchmark: ${englandAreaString}`)
    ).toBeInTheDocument();
  });

  it('renders the group legend when selectedGroupCode is not England', () => {
    mockSearchState = {
      [SearchParams.GroupSelected]: 'A001',
    };
    render(<SpineChartLegend {...defaultProps} />);
    expect(screen.getByText('Group: Test Group')).toBeInTheDocument();
  });

  it('should not render alternative benchmark legend as England when group is benchmark', () => {
    render(<SpineChartLegend {...defaultProps} benchmarkToUse="GROUP_CODE" />);
    expect(screen.getByText(`Benchmark: Test Group`)).toBeInTheDocument();
    expect(screen.queryByText(englandAreaString)).not.toBeInTheDocument();
  });

  it('renders all area names as legend items', () => {
    render(<SpineChartLegend {...defaultProps} />);
    expect(screen.getByText('Area 1')).toBeInTheDocument();
    expect(screen.getByText('Area 2')).toBeInTheDocument();
  });

  it('renders BenchmarkLegends and SpineChartQuartilesInfoContainer', () => {
    render(<SpineChartLegend {...defaultProps} />);
    expect(screen.getByTestId('benchmarkLegend-component')).toBeInTheDocument();
    expect(screen.getByTestId('quartiles-info')).toBeInTheDocument();
  });
});
