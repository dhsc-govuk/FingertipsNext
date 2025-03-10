import { Trend, TrendCondition } from '@/lib/common-types';
import { TrendTag } from '.';
import { render, screen } from '@testing-library/react';

describe('Trend Tag Suite', () => {
  it('should render expected elements', () => {
    render(
      <TrendTag
        trend={Trend.INCREASING}
        trendCondition={TrendCondition.GETTING_BETTER}
      />
    );

    expect(screen.getByTestId('trendTag-container')).toBeInTheDocument();
    expect(screen.getByTestId('tag-component')).toBeInTheDocument();
    expect(screen.getByTestId('arrow-icon')).toBeInTheDocument();
    expect(screen.getByRole('paragraph')).toBeInTheDocument();
  });

  describe('should render elements according to props', () => {
    it('should render decreasing trend', () => {
      render(
        <TrendTag
          trend={Trend.DECREASING}
          trendCondition={TrendCondition.GETTING_BETTER}
        />
      );

      expect(screen.getByTestId('arrow-down')).toBeInTheDocument();
      expect(screen.getByRole('paragraph')).toHaveTextContent(
        'Decreasing and getting better'
      );
    });

    it('should render increasing trend', () => {
      render(
        <TrendTag
          trend={Trend.INCREASING}
          trendCondition={TrendCondition.GETTING_WORSE}
        />
      );

      expect(screen.getByTestId('arrow-up')).toBeInTheDocument();
      expect(screen.getByRole('paragraph')).toHaveTextContent(
        'Increasing and getting worse'
      );
    });

    it('should render no significant change', () => {
      render(<TrendTag trend={Trend.NO_SIGNIFICANT_CHANGE} />);

      expect(screen.getByTestId('arrow-right')).toBeInTheDocument();
      expect(screen.getByRole('paragraph')).toHaveTextContent(
        'No significant change'
      );
    });

    it('should render increasing trend without condition', () => {
      render(<TrendTag trend={Trend.INCREASING} />);

      expect(screen.getByTestId('arrow-up')).toBeInTheDocument();
      expect(screen.getByRole('paragraph')).toHaveTextContent('Increasing');
    });

    it('should render decreasing trend without condition', () => {
      render(<TrendTag trend={Trend.DECREASING} />);

      expect(screen.getByTestId('arrow-down')).toBeInTheDocument();
      expect(screen.getByRole('paragraph')).toHaveTextContent('Decreasing');
    });
  });

  it('snapshot test', () => {
    const container = render(
      <TrendTag
        trend={Trend.INCREASING}
        trendCondition={TrendCondition.GETTING_WORSE}
      />
    );

    expect(container.asFragment()).toMatchSnapshot();
  });
});
