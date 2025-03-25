import { render, screen } from '@testing-library/react';
import { BenchmarkLegend } from '.';
import '@testing-library/jest-dom';

describe('Testing the benchmark component', () => {
  it('Snapshot testing of the UI', () => {
    const container = render(<BenchmarkLegend rag quintiles />);
    expect(container.asFragment()).toMatchSnapshot();
  });

  it('Should only render RAG points', () => {
    render(<BenchmarkLegend rag />);
    expect(screen.getAllByText('Better')).toHaveLength(2);
    expect(screen.queryByText('Worst')).not.toBeInTheDocument();
    expect(screen.queryByText('Quintiles')).not.toBeInTheDocument();
  });

  it('Should only render quintile points', () => {
    render(<BenchmarkLegend quintiles />);
    expect(screen.getAllByText('Worst')).toHaveLength(1);
    expect(screen.getAllByText('Lowest')).toHaveLength(1);
    expect(screen.queryByText('Not compared')).not.toBeInTheDocument();
  });
});
