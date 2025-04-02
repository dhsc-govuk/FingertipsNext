import { render } from '@testing-library/react';
import { HeatmapCell } from './heatmapCell';
import { CellType } from './heatmapUtil';
import { GovukColours } from '@/lib/styleHelpers/colours';

describe('heatmap cell', () => {
  it.each([
    [CellType.IndicatorTitle, 'heatmap-cell-indicator-title'],
    [CellType.IndicatorInformation, 'heatmap-cell-indicator-info'],
    [CellType.Data, 'heatmap-cell-data'],
  ])(
    'should render appropriate cell type %s with default background and text colour',
    (cellType, expectedTestId) => {
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
