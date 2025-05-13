import { BarChartEmbeddedPlaceholderRows } from '@/components/organisms/BarChartEmbeddedTable/BarChartEmbeddedPlaceholderRows';
import { act, render, screen, waitFor } from '@testing-library/react';
import { useEffect, useRef } from 'react';
import { barChartEmbeddedRowClassName } from '@/components/organisms/BarChartEmbeddedTable/barChartEmbeddedTableHelpers';

const TestBarChartEmbeddedPlaceholderRows = ({
  nRowsToHide = 10,
  nRowsToShow = 10,
}) => {
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRows = Array(nRowsToShow)
    .fill(null)
    .map((_, i) => `content-${i}`);

  useEffect(() => {
    const rows = document.getElementsByClassName(barChartEmbeddedRowClassName);
    if (!rows.length) return;
    rows[0].getBoundingClientRect = jest.fn(() => ({ top: 50 }) as DOMRect);
    rows[nRowsToShow - 1].getBoundingClientRect = jest.fn(
      () => ({ bottom: 123 * nRowsToShow }) as DOMRect
    );
  }, [nRowsToShow]);

  return (
    <table>
      <tbody>
        {contentRows.map((key) => (
          <tr
            key={key}
            style={{ height: '123px' }}
            className={barChartEmbeddedRowClassName}
          >
            <td>{key}</td>
          </tr>
        ))}
        <BarChartEmbeddedPlaceholderRows
          nRowsToHide={nRowsToHide}
          triggerRef={triggerRef}
        />
      </tbody>
    </table>
  );
};

const testRender = (nRowsToHide = 10, nRowsToShow = 0) => {
  act(() => {
    render(
      <TestBarChartEmbeddedPlaceholderRows
        nRowsToHide={nRowsToHide}
        nRowsToShow={nRowsToShow}
      />
    );
  });
};

describe('BarChartEmbeddedPlaceholderRows', () => {
  it('should render 5 rows with one td each', () => {
    testRender(5);

    expect(screen.getAllByRole('row')).toHaveLength(5);
    expect(screen.getAllByRole('cell')).toHaveLength(5);
  });

  it('should render InViewTrigger in the first cell', () => {
    testRender(3);

    const rows = screen.getAllByRole('row');
    expect(rows[0]).toHaveTextContent('More');
    expect(rows[1]).toHaveTextContent('');
    expect(rows[2]).toHaveTextContent('');
  });

  it('should nothing if nRowsToHide is zero', () => {
    testRender(0);
    expect(screen.queryAllByRole('row')).toHaveLength(0);
  });

  it('should set the height of the placeholders to the average height of the other rows', () => {
    testRender(10, 10);

    const cells = screen.getAllByRole('cell');
    waitFor(() => {
      expect(cells[10]).toHaveStyle('height: 123px');
    });
  });
});
