import { GovukColours } from '@/lib/styleHelpers/colours';
import { render } from '@testing-library/react';
import { DataCell } from './dataCell';

describe('data cell', () => {
  it('should render white background with black text by default', () => {
    const screen = render(
      <table>
        <tbody>
          <tr>
            <DataCell content={''} />
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
            <DataCell content={''} backgroundColour={expectedColour} />
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
            <DataCell
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
