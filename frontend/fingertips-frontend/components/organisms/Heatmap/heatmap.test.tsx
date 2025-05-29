import { render } from '@testing-library/react';
import { Heatmap } from '.';
import {
  placeholderGroupAreaCode,
  placeholderHeatmapIndicatorData as placeholderIndicatorData,
} from './heatmapUtil.test';
import { BenchmarkReferenceType } from '@/generated-sources/ft-api-client';

it('snapshot test', () => {
  const container = render(
    <Heatmap
      indicatorData={placeholderIndicatorData}
      groupAreaCode={placeholderGroupAreaCode}
      benchmarkRefType={BenchmarkReferenceType.England}
    />
  );

  expect(container.asFragment()).toMatchSnapshot();
});
