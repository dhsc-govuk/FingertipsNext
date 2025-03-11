import { render } from '@testing-library/react';
import { BenchmarkLegend } from '.';
import '@testing-library/jest-dom';

describe('Testing the benchmark component', () => {
  it('Snapshot testing of the UI', () => {
    const container = render(<BenchmarkLegend />);
    expect(container.asFragment()).toMatchSnapshot();
  });
});
