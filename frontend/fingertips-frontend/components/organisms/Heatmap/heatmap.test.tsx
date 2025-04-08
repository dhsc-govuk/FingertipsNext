import {
  act,
  render,
  waitFor,
  fireEvent,
  screen,
} from '@testing-library/react';
import { Heatmap } from '.';
import {
  placeholderGroupAreaCode,
  placeholderHeatmapIndicatorData as placeholderIndicatorData,
} from './heatmapUtil.test';

it('snapshot test', () => {
  const container = render(
    <Heatmap
      indicatorData={placeholderIndicatorData}
      groupAreaCode={placeholderGroupAreaCode}
    />
  );

  expect(container.asFragment()).toMatchSnapshot();
});

describe('hover display', () => {
  it('should not show hover by default', () => {
    const screen = render(
      <Heatmap
        indicatorData={placeholderIndicatorData}
        groupAreaCode={placeholderGroupAreaCode}
      />
    );

    expect(
      screen.queryByTestId('heatmap-hover-component')
    ).not.toBeInTheDocument();

    expect(
      screen.queryAllByText(placeholderIndicatorData[0].indicatorName)
    ).toHaveLength(1);
  });

  it.skip('should show hover when mouse over', async () => {
    act(() => {
      render(
        <Heatmap
          indicatorData={placeholderIndicatorData}
          groupAreaCode={placeholderGroupAreaCode}
        />
      );
    });

    act(() => {
      fireEvent.mouseOver(screen.getAllByTestId('heatmap-cell-data')[0]);
    });

    await waitFor(() => {
      expect(screen.getByTestId('heatmap-hover-component'));
    });
  });
});
