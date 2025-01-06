import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { registryWrapper } from '@/lib/testutils';
import { mockHeadings, mockHealthData } from '@/mock/data/healthdata';
import { BarChartTable } from '@/components/organisms/BarChartTable/index';

test('snapshot test - should match snapshot', () => {
  const container = render(
    registryWrapper(
      <BarChartTable data={mockHealthData} headings={mockHeadings} />
    )
  );
  expect(container.asFragment()).toMatchSnapshot();
});

test('should render the BarChartTable component', () => {
  render(
    registryWrapper(
      <BarChartTable data={mockHealthData} headings={mockHeadings} />
    )
  );
  const barChart = screen.getByTestId('barChartTable-component');
  expect(barChart).toBeInTheDocument();
});