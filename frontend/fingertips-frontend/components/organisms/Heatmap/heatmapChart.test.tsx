import { act, render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { HeatmapChart } from '@/components/organisms/Heatmap/index';

it('should render the Highcharts react component within the HeatmapChart component ', async () => {
  await act(async () =>
    render(
      <HeatmapChart accessibilityLabel="A heatmap chart showing healthcare data" />
    )
  );

  const highcharts = screen.getByTestId(
    'highcharts-react-component-heatmapChart'
  );
  expect(highcharts).toBeInTheDocument();
});

it('should render the Heatmap title', async () => {
  await act(async () =>
    render(
      <HeatmapChart accessibilityLabel="A heatmap chart showing healthcare data" />
    )
  );

  const title = screen.getByRole('heading', { level: 3 });
  expect(title).toHaveTextContent('Heatmap Chart Title');
});
