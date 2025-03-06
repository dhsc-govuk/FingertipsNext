import { render, screen, within } from '@testing-library/react';
import { BenchmarkLegend } from '.';
import '@testing-library/jest-dom';

describe('Testing the benchmark component', () => {
  it('renders correctly with provided benchmark data', () => {
    render(<BenchmarkLegend />);

    const txtEngland = screen.getByText('Areas compared to England');
    expect(screen.queryByText('legend_panel_header')).not.toBeInTheDocument();
    expect(txtEngland).toBeInTheDocument();

    const divRag = txtEngland.parentElement as HTMLElement;
    expect(divRag).not.toBeNull();
    expect(within(divRag).getByText('Better')).toBeInTheDocument();
    expect(within(divRag).getByText('Similar')).toBeInTheDocument();
    expect(within(divRag).getByText('Not compared')).toBeInTheDocument();
    expect(within(divRag).getByText('Lower')).toBeInTheDocument();
    expect(within(divRag).getByText('Higher')).toBeInTheDocument();

    const txtQuintile = screen.getByText('Quintile groupings');
    expect(txtQuintile).toBeInTheDocument();

    const divQuintile = txtQuintile.parentElement as HTMLElement;
    expect(divQuintile).not.toBeNull();
    expect(within(divQuintile).getByText('Lowest')).toBeInTheDocument();
    expect(within(divQuintile).getByText('Low')).toBeInTheDocument();
    expect(within(divQuintile).getByText('Middle')).toBeInTheDocument();
    expect(within(divQuintile).getByText('High')).toBeInTheDocument();
    expect(within(divQuintile).getByText('Highest')).toBeInTheDocument();

    // No Labels
    const divQuintileWV = divQuintile.nextSibling as HTMLElement;
    expect(divQuintileWV).not.toBeNull();
    expect(within(divQuintileWV).getByText('Worst')).toBeInTheDocument();
    expect(within(divQuintileWV).getByText('Worse')).toBeInTheDocument();
    expect(within(divQuintileWV).getByText('Middle')).toBeInTheDocument();
    expect(within(divQuintileWV).getByText('Better')).toBeInTheDocument();
    expect(within(divQuintileWV).getByText('Best')).toBeInTheDocument();
  });

  it('Snapshot testing of the UI', () => {
    const container = render(<BenchmarkLegend />);
    expect(container.asFragment()).toMatchSnapshot();
  });
});
