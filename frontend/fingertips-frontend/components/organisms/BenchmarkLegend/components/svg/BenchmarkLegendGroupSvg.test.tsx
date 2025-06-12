import React from 'react';
import { render, screen } from '@testing-library/react';
import { BenchmarkLegendGroupSvg } from './BenchmarkLegendGroupSvg';
import {
  BenchmarkComparisonMethod,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import { ragOutcomes } from '@/components/organisms/BenchmarkLegend/benchmarkLegendHelpers';

describe('BenchmarkLegendGroupSvg', () => {
  it('renders subtitle and legend items', () => {
    const { container } = render(
      <svg>
        <BenchmarkLegendGroupSvg
          y={50}
          outcomes={ragOutcomes}
          benchmarkComparisonMethod={
            BenchmarkComparisonMethod.CIOverlappingReferenceValue95
          }
          polarity={IndicatorPolarity.HighIsGood}
        />
      </svg>
    );

    // Subtitle text
    expect(screen.getByText('95% confidence')).toBeInTheDocument();

    // Each outcome label
    expect(screen.getByText('Better')).toBeInTheDocument();
    expect(screen.getByText('Worse')).toBeInTheDocument();

    // Correct number of rects
    const rects = container.querySelectorAll('rect');
    expect(rects).toHaveLength(ragOutcomes.length);

    // Correct number of texts
    const texts = container.querySelectorAll('text');
    expect(texts).toHaveLength(ragOutcomes.length + 1);
  });

  it('uses custom subTitle when provided', () => {
    render(
      <svg>
        <BenchmarkLegendGroupSvg
          y={0}
          outcomes={ragOutcomes}
          benchmarkComparisonMethod={
            BenchmarkComparisonMethod.CIOverlappingReferenceValue95
          }
          polarity={IndicatorPolarity.NoJudgement}
          subTitle="Custom Subtitle"
        />
      </svg>
    );

    expect(screen.getByText('Custom Subtitle')).toBeInTheDocument();
  });

  it('renders without subtitle if none is provided and method has no confidence limit', () => {
    const { container } = render(
      <svg>
        <BenchmarkLegendGroupSvg
          outcomes={ragOutcomes}
          benchmarkComparisonMethod={
            BenchmarkComparisonMethod.CIOverlappingReferenceValue95
          }
          polarity={IndicatorPolarity.HighIsGood}
        />
      </svg>
    );

    expect(container).toHaveTextContent(
      '95% confidenceBetterSimilarWorseNot compared'
    );
  });
});
