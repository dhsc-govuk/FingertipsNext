import { render } from '@testing-library/react';
import { Heatmap } from '.';
import {
  placeholderGroupAreaCode,
  placeholderHeatmapIndicatorData as placeholderIndicatorData,
} from './heatmapUtil.test';
import {
  areaCodeForEngland,
  englandAreaString,
} from '@/lib/chartHelpers/constants';

it('snapshot test - england benchmark', () => {
  const container = render(
    <Heatmap
      indicatorData={placeholderIndicatorData}
      groupAreaCode={placeholderGroupAreaCode}
      benchmarkAreaCode={areaCodeForEngland}
      benchmarkAreaName={englandAreaString}
    />
  );

  expect(container.asFragment()).toMatchSnapshot();
});

it('snapshot test - group area benchmark', () => {
  const container = render(
    <Heatmap
      indicatorData={placeholderIndicatorData}
      groupAreaCode={placeholderGroupAreaCode}
      benchmarkAreaCode={placeholderGroupAreaCode}
      benchmarkAreaName={
        placeholderIndicatorData[0].healthDataForAreas.find((healthData) => {
          return healthData.areaCode === placeholderGroupAreaCode;
        })?.areaName ?? 'no group area in data?'
      }
    />
  );

  expect(container.asFragment()).toMatchSnapshot();
});
