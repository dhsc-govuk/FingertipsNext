import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { registryWrapper } from '@/lib/testutils';
import { LineChartTable } from '@/components/organisms/LineChartTable/index';
import { mockHeadings, mockHealthData } from '@/mock/data/healthdata';

test('snapshot test - should match snapshot', () => {
  const container = render(
    registryWrapper(
      <LineChartTable data={mockHealthData} headings={mockHeadings} />
    )
  );
  expect(container.asFragment()).toMatchSnapshot();
});

test('should render the LineChartTable component', () => {
  render(
    registryWrapper(
      <LineChartTable data={mockHealthData} headings={mockHeadings} />
    )
  );
  const lineChart = screen.getByTestId('lineChartTable-component');
  expect(lineChart).toBeInTheDocument();
});
