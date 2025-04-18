import { render } from '@testing-library/react';
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
