import { render } from '@testing-library/react';
import { HeatmapCell } from '.';
import { CellType } from '../../heatmapUtil';

describe('cell types', () => {
  it.each([
    [
      'indicator title',
      CellType.IndicatorTitle,
      'heatmap-cell-indicator-title',
    ],
    [
      'indicator information period',
      CellType.IndicatorInformationPeriod,
      'heatmap-cell-indicator-info-period',
    ],
    [
      'indicator information value unit',
      CellType.IndicatorInformationValueUnit,
      'heatmap-cell-indicator-info-value-unit',
    ],
    ['data', CellType.Data, 'heatmap-cell-data'],
  ])(
    'should render appropriate type for %s cell',
    (_, cellType, expectedTestId) => {
      const screen = render(
        <table>
          <tbody>
            <tr>
              <HeatmapCell cellType={cellType} content={''} />
            </tr>
          </tbody>
        </table>
      );

      expect(screen.getByTestId(expectedTestId)).toBeInTheDocument();
    }
  );
});
