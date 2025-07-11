import { render } from '@testing-library/react';
import { HeatmapHeader } from '.';
import { HeaderType } from '../../heatmap.types';

describe('header types', () => {
  it.each([
    [
      'indicator title',
      HeaderType.IndicatorTitle,
      'heatmap-header-indicator-title',
    ],
    ['indicator period', HeaderType.Period, 'heatmap-header-period'],
    ['indicator value unit', HeaderType.ValueUnit, 'heatmap-header-value-unit'],
    [
      'benchmark group',
      HeaderType.BenchmarkGroupArea,
      'heatmap-header-benchmark-group',
    ],
    [
      'non-benchmark group',
      HeaderType.NonBenchmarkGroupArea,
      'heatmap-header-non-benchmark-group',
    ],
    ['area', HeaderType.Area, 'heatmap-header-area'],
  ])(
    'should render appropriate type for %s header',
    (_, headerType, expectedTestId) => {
      const screen = render(
        <table>
          <tbody>
            <tr>
              <HeatmapHeader headerType={headerType} content={''} />
            </tr>
          </tbody>
        </table>
      );

      expect(screen.getByTestId(expectedTestId)).toBeInTheDocument();
    }
  );
});
