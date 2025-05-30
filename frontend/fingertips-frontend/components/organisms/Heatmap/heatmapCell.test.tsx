import { render } from '@testing-library/react';
import { HeatmapCell } from './heatmapCell';
import { CellType } from './heatmapUtil';
import { GovukColours } from '@/lib/styleHelpers/colours';

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

describe('data cell', () => {
  it('should render white background with black text by default', () => {
    const screen = render(
      <table>
        <tbody>
          <tr>
            <HeatmapCell cellType={CellType.Data} content={''} />
          </tr>
        </tbody>
      </table>
    );

    const cell = screen.getByTestId('heatmap-cell-data');
    expect(cell).toHaveStyle({
      'color': GovukColours.Black,
      'background-color': GovukColours.White,
    });
  });

  it('should render background colour if given', () => {
    const expectedColour = GovukColours.Yellow;
    const screen = render(
      <table>
        <tbody>
          <tr>
            <HeatmapCell
              cellType={CellType.Data}
              content={''}
              backgroundColour={expectedColour}
            />
          </tr>
        </tbody>
      </table>
    );

    const cell = screen.getByTestId('heatmap-cell-data');
    expect(cell).toHaveStyle({
      'background-color': expectedColour,
    });
  });
  it('should render with appropriate text colour', () => {
    const expectedBackgroundColour = GovukColours.Red;
    const expectedTextColour = GovukColours.White;
    const screen = render(
      <table>
        <tbody>
          <tr>
            <HeatmapCell
              cellType={CellType.Data}
              content={''}
              backgroundColour={expectedBackgroundColour}
            />
          </tr>
        </tbody>
      </table>
    );

    const cell = screen.getByTestId('heatmap-cell-data');
    expect(cell).toHaveStyle({
      'background-color': expectedBackgroundColour,
      'color': expectedTextColour,
    });
  });
});
