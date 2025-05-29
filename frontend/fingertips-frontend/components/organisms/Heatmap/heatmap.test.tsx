import { render } from '@testing-library/react';
import { Heatmap } from '.';
import {
  placeholderGroupAreaCode,
  placeholderHeatmapIndicatorData as placeholderIndicatorData,
} from './heatmapUtil.test';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';

it('snapshot test', () => {
  const container = render(
    <Heatmap
      indicatorData={placeholderIndicatorData}
      groupAreaCode={placeholderGroupAreaCode}
      benchmarkAreaCode={areaCodeForEngland}
    />
  );

  expect(container.asFragment()).toMatchSnapshot();
});
