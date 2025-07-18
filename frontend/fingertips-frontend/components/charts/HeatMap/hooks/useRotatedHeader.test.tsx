import React from 'react';
import { render, screen } from '@testing-library/react';
import { useRotatedHeaders } from './useRotatedHeaders';
import { HeaderType } from '../heatmap.types';

const headers = [
  { key: 'key', type: HeaderType.BenchmarkGroupArea, content: 'content' },
];

const TestComponent = () => {
  const { containerRef } = useRotatedHeaders(headers);

  return (
    <div ref={containerRef}>
      <table>
        <thead>
          <tr>
            <th>
              <h4>Overflow Header</h4>
            </th>
          </tr>
        </thead>
      </table>
    </div>
  );
};

describe('useRotatedHeaders', () => {
  beforeEach(() => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
      function (this: HTMLElement) {
        // override getBoundingClientRect based on element
        if (this.tagName === 'H4') {
          return {
            height: 50,
            right: 300,
          } as DOMRect;
        }

        // TABLE) {
        return {
          height: 0,
          right: 250,
        } as DOMRect;
      }
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('adds right margin when headers extend beyond table edge', () => {
    render(<TestComponent />);

    const th = screen.getByRole('columnheader');
    expect(th).toHaveStyle('height: 80px'); // 50 + 30

    const table = screen.getByRole('table');
    expect(table.style.marginRight).toBe('50px'); // 300 (h4) - 250 (table)
  });
});
