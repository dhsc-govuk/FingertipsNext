import { render } from '@testing-library/react';
import { HeatMap } from './HeatMap';
import {
  placeholderGroupAreaCode,
  placeholderHeatmapIndicatorData as placeholderIndicatorData,
} from './helpers/prepareHeatmapData.test';
import {
  areaCodeForEngland,
  englandAreaString,
} from '@/lib/chartHelpers/constants';

describe('heatmap', () => {
  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-12-25T12:00:00Z'));
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it('snapshot test - england benchmark', () => {
    const container = render(
      <HeatMap
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
      <HeatMap
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
});
