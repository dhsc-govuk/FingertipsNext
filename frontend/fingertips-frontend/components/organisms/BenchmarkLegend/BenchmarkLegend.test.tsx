
import { render, screen } from '@testing-library/react';
import { BenchmarkLegend,  BenchmarkLegendData } from './BenchmarkLegend';
import '@testing-library/jest-dom';



describe('Testing the BenchmarkLegend component', () => {
  it('renders without crashing with an empty model', () => {
    render(<BenchmarkLegend model={[]} />);
    expect(screen.queryByTestId('legend-label')).not.toBeInTheDocument();
  });

  it('renders a single legend item', () => {
    const model: BenchmarkLegendData[] = [{ group: 'rag', labels: [{ label: 'Better (95%)', type: 'better' }] }];
    render(<BenchmarkLegend model={model} />);
    expect(screen.getByText('Better (95%)')).toBeInTheDocument();
  });

  it('renders multiple legend items', () => {
    const model: BenchmarkLegendData[] = [{
      group: 'rag',
      labels: [
        { label: 'Better (76%)', type: 'better' },
        { label: 'Worse (75%)', type: 'worse' }
      ]
    }];
    render(<BenchmarkLegend model={model} />);
    expect(screen.getByText('Better (76%)')).toBeInTheDocument();
    expect(screen.getByText('Worse (75%)')).toBeInTheDocument();
  });

  it('does not render a title if not provided', () => {
    const model: BenchmarkLegendData[] = [{ group: 'test', labels: [{ label: 'Test Label', type: 'test' }] }];
    render(<BenchmarkLegend model={model} />);
    expect(screen.queryByText('legend_panel_header')).not.toBeInTheDocument();
  });

  it('renders correctly with provided benchmark data', () => {
    const benchmarkData: BenchmarkLegendData[] = [
      {
        group: 'rag',
        title: 'Areas compared to England',
        labels: [
          { label: 'Better (65%)', type: 'better' },
          { label: 'Similar', type: 'similar' },
          { label: 'Worse (95%)', type: 'worse' },
          { label: 'Not compared', type: 'not_compared' },
          { label: 'Lower (95%)', type: 'lower' },
          { label: 'Higher (95%)', type: 'higher' }
        ]
      },
      {
        title: ' Quintile groupings',
        group: 'quintile',
        labels: [
          { label: 'Lowest', type: 'lowest' },
          { label: 'Low', type: 'low' },
          { label: 'Middle', type: 'middle' },
          { label: 'High', type: 'high' },
          { label: 'Highest', type: 'highest' }
        ]
      },
      {
        group: 'others',
        labels: [
          { label: 'Worst', type: 'worst' },
          { label: 'Worse', type: 'worse' },
          { label: 'Middle', type: 'middle' },
          { label: 'Better', type: 'better' },
          { label: 'Best', type: 'best' }
        ]
      }
    ];
    
    render(<BenchmarkLegend model={benchmarkData} />);
    expect(screen.getByText('Areas compared to England')).toBeInTheDocument();
    expect(screen.getByText('Quintile groupings')).toBeInTheDocument();
    expect(screen.getByText('Better (65%)')).toBeInTheDocument();
    expect(screen.getByText('Worst')).toBeInTheDocument();
  });
});
