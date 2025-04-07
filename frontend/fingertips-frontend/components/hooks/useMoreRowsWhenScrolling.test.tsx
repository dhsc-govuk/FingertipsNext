import { act, render, screen } from '@testing-library/react';
import { useMoreRowsWhenScrolling } from './useMoreRowsWhenScrolling';

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  configurable: true,
  value: 800,
});

const rows = Array.from({ length: 100 }, (_, i) => `Row ${i + 1}`);

const TestComponent = ({ incrementRowCount = 10 }) => {
  const { rowsToShow, triggerRef, hasMore } = useMoreRowsWhenScrolling(
    rows,
    incrementRowCount
  );

  return (
    <>
      {rowsToShow.map((row, i) => (
        <div key={i} role={'row'}>
          ROW: {row + 1}
        </div>
      ))}
      <div data-testid="trigger" ref={triggerRef}>
        {hasMore ? 'Loading...' : 'ALL SHOWING'}
      </div>
    </>
  );
};

const getBoundingClientRectMock = (top: number) => {
  return jest.fn(() => ({
    top,
    bottom: 610,
    left: 0,
    right: 100,
    width: 100,
    height: 10,
    x: 0,
    y: 600,
    toJSON: () => {},
  }));
};

describe('useMoreRowsWhenScrolling', () => {
  let intervalSpy: jest.SpyInstance<
    NodeJS.Timeout,
    [callback: () => void, ms?: number]
  >;
  beforeEach(() => {
    intervalSpy = jest.spyOn(global, 'setInterval');

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    intervalSpy.mockImplementation(() => 1234);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('adds rows when trigger is visible in viewport on initial render', async () => {
    // starts with 10
    act(() => {
      render(<TestComponent incrementRowCount={10} />);
    });

    expect(intervalSpy).toHaveBeenCalledWith(expect.any(Function), 100);

    // as trigger is visible immediated add another 10
    const renderedRows = screen.getAllByRole('row');
    expect(renderedRows).toHaveLength(20);
  });

  it('adds rows when trigger is visible in viewport', async () => {
    act(() => {
      render(<TestComponent incrementRowCount={10} />);
    });

    const timerFunc = intervalSpy.mock.calls[0][0];
    act(() => {
      timerFunc();
    });

    const renderedRows = screen.getAllByRole('row');
    expect(renderedRows).toHaveLength(30);
  });

  it('stops adding rows when trigger is no longer visible in viewport', async () => {
    act(() => {
      render(<TestComponent incrementRowCount={10} />);
    });

    const timerFunc = intervalSpy.mock.calls[0][0];
    act(() => {
      timerFunc();
    });

    const renderedRows = screen.getAllByRole('row');
    expect(renderedRows).toHaveLength(30);

    const triggerEl = screen.getByTestId('trigger');
    triggerEl.getBoundingClientRect = getBoundingClientRectMock(1600);

    act(() => {
      timerFunc();
    });

    const renderedRowsAfterMovingOffscreen = screen.getAllByRole('row');
    expect(renderedRowsAfterMovingOffscreen).toHaveLength(30);
  });

  it('stops when all rows are shown', () => {
    act(() => {
      render(<TestComponent incrementRowCount={20} />);
    });

    const timerFunc = intervalSpy.mock.calls[0][0];
    act(() => {
      timerFunc(); // 60 rows
      timerFunc(); // 80 rows
    });

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    act(() => {
      timerFunc(); // 100 rows
    });
    expect(screen.getByText('ALL SHOWING')).toBeInTheDocument();

    act(() => {
      timerFunc(); // 100 rows - no difference
      timerFunc(); // 100 rows - no difference
    });

    const renderedRows = screen.getAllByRole('row');
    expect(renderedRows).toHaveLength(100);
  });

  it('adds rows when trigger is visible and a scrollevent occurs', async () => {
    act(() => {
      render(<TestComponent incrementRowCount={10} />);
    });

    const triggerEl = screen.getByTestId('trigger');
    triggerEl.getBoundingClientRect = getBoundingClientRectMock(1600);

    const timerFunc = intervalSpy.mock.calls[0][0];
    act(() => {
      // register that the element is offscreen
      timerFunc();
    });

    const renderedRows = screen.getAllByRole('row');
    expect(renderedRows).toHaveLength(20);

    // put the element back on screen
    triggerEl.getBoundingClientRect = getBoundingClientRectMock(600);

    // scroll and more rows should be added
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    const renderedRowsAfterScroll = screen.getAllByRole('row');
    expect(renderedRowsAfterScroll).toHaveLength(30);
  });
});
