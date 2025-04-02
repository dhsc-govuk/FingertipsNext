import { render } from '@testing-library/react';
import { HeatmapCell } from './heatmapCell';
import { CellType } from './heatmapUtil';

describe('heatmap cell', () => {
  it.each([
    [CellType.IndicatorTitle, 'heatmap-cell-indicator-title'],
    [CellType.IndicatorInformation, 'heatmap-cell-indicator-info'],
    [CellType.Data, 'heatmap-cell-data'],
  ])('cell type %s', (cellType, expectedTestId) => {
    const cell = render(
      <table>
        <tbody>
          <tr>
            <HeatmapCell cellType={cellType} content={''} />
          </tr>
        </tbody>
      </table>
    );
    expect(cell.getByTestId(expectedTestId)).toBeInTheDocument;
  });
});
