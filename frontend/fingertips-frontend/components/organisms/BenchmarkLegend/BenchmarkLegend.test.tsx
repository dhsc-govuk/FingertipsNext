import { render, screen } from '@testing-library/react';
import { Benchmark } from '.';
import '@testing-library/jest-dom';
import { describe } from 'node:test';

describe('Testing the benchmark component', () => {
  it('renders correctly with provided benchmark data', () => {
    render(<Benchmark />);
    expect(screen.queryByText('legend_panel_header')).not.toBeInTheDocument();
    expect(screen.getByText('Areas compared to England')).toBeInTheDocument();
    expect(screen.getByText('Better (95%)')).toBeInTheDocument();
    expect(screen.getByText('Similar')).toBeInTheDocument();
    expect(screen.getByText('Not compared')).toBeInTheDocument();
    expect(screen.getByText('Lower (95%)')).toBeInTheDocument();
    expect(screen.getByText('Higher (95%)')).toBeInTheDocument();

    expect(screen.getByText('Quintile groupings')).toBeInTheDocument();
    expect(screen.getByText('Lowest')).toBeInTheDocument();
    expect(screen.getByText('Low')).toBeInTheDocument();
    expect(screen.getAllByText('Middle')).toHaveLength(2);
    expect(screen.getByText('High')).toBeInTheDocument();
    expect(screen.getByText('Highest')).toBeInTheDocument();

    // No Labels
    expect(screen.getByText('Worst')).toBeInTheDocument();
    expect(screen.getByText('Worse')).toBeInTheDocument();
    expect(screen.getByText('Better')).toBeInTheDocument();
    expect(screen.getByText('Best')).toBeInTheDocument();
  });

  it('Snapshot testing of the UI', () => {
    const container = render(<Benchmark />);
    expect(container.asFragment()).toMatchSnapshot();
  });
});
