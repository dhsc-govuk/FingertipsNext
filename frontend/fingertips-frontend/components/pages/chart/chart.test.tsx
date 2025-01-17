import { render, screen } from '@testing-library/react';
import { Chart } from '@/components/pages/chart/index';
import { expect } from '@jest/globals';
import { mockHealthData } from '@/mock/data/healthdata';
import { SearchParams } from '@/lib/searchStateManager';

describe('Page structure', () => {
  const props = {
    data: mockHealthData,
    searchedIndicator: 'test',
    indicatorsSelected: ['1', '2'],
  };
  describe('Navigation', () => {
    it('should render back link with correct search parameters', () => {
      render(<Chart {...props} />);

      const backLink = screen.getByRole('link', { name: /back/i });
      const expectedUrl = `/search/results?${SearchParams.SearchedIndicator}=test&${SearchParams.IndicatorsSelected}=1&${SearchParams.IndicatorsSelected}=2`;

      expect(backLink).toBeInTheDocument();
      expect(backLink).toHaveAttribute('data-testid', 'chart-page-back-link');
      expect(backLink).toHaveAttribute('href', expectedUrl);
    });
  });

  describe('Content', () => {
    beforeEach(() => {
      render(<Chart {...props} />);
    });

    it('should render the title with correct text', () => {
      const heading = screen.getByRole('heading', { level: 2 });

      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('View Dementia QOF prevalence');
    });

    it('should render the chart components', () => {
      const lineChart = screen.getByTestId('lineChart-component');
      const barChart = screen.getByTestId('barChart-component');
      const lineChartTable = screen.getByTestId('lineChartTable-component');

      expect(lineChart).toBeInTheDocument();
      expect(barChart).toBeInTheDocument();
      expect(lineChartTable).toBeInTheDocument();
    });
  });
});
