import { Trend, TrendCondition } from '@/lib/common-types';
import { mapTrendResponse, TrendTag } from '.';
import { render, screen } from '@testing-library/react';
import { HealthDataPointTrendEnum } from '@/generated-sources/ft-api-client/models/HealthDataPoint';

describe('Trend Tag Suite', () => {
  it('should render expected elements', () => {
    render(
      <TrendTag
        trendFromResponse={HealthDataPointTrendEnum.IncreasingAndGettingBetter}
      />
    );

    expect(screen.getByTestId('trendTag-container')).toBeInTheDocument();
    expect(screen.getByTestId('tag-component')).toBeInTheDocument();
    expect(screen.getByTestId('arrow-icon')).toBeInTheDocument();
    expect(screen.getByRole('paragraph')).toBeInTheDocument();
  });

  describe('mapTrendResponse function', () => {
    it.each([
      [
        HealthDataPointTrendEnum.CannotBeCalculated,
        Trend.NOT_AVAILABLE,
        undefined,
      ],
      [
        HealthDataPointTrendEnum.NotYetCalculated,
        Trend.NOT_AVAILABLE,
        undefined,
      ],
      [
        HealthDataPointTrendEnum.NoSignificantChange,
        Trend.NO_SIGNIFICANT_CHANGE,
        undefined,
      ],
      [HealthDataPointTrendEnum.Increasing, Trend.INCREASING, undefined],
      [
        HealthDataPointTrendEnum.IncreasingAndGettingBetter,
        Trend.INCREASING,
        TrendCondition.GETTING_BETTER,
      ],
      [
        HealthDataPointTrendEnum.DecreasingAndGettingBetter,
        Trend.DECREASING,
        TrendCondition.GETTING_BETTER,
      ],
      [
        HealthDataPointTrendEnum.DecreasingAndGettingWorse,
        Trend.DECREASING,
        TrendCondition.GETTING_WORSE,
      ],
    ])(
      'should break down trend strings from the API to relevant values for %s',
      (trendFromResponse, expectedTrend, expectedTrendCondition) => {
        const { trend, trendCondition } = mapTrendResponse(trendFromResponse);
        expect(trend).toEqual(expectedTrend);
        expect(trendCondition).toEqual(expectedTrendCondition);
      }
    );
  });

  describe('should render elements according to props', () => {
    it('should render decreasing trend', () => {
      render(
        <TrendTag
          trendFromResponse={
            HealthDataPointTrendEnum.DecreasingAndGettingBetter
          }
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
          trendFromResponse={HealthDataPointTrendEnum.IncreasingAndGettingWorse}
        />
      );

      expect(screen.getByTestId('arrow-up')).toBeInTheDocument();
      expect(screen.getByRole('paragraph')).toHaveTextContent(
        'Increasing and getting worse'
      );
    });

    it('should render no significant change', () => {
      render(
        <TrendTag
          trendFromResponse={HealthDataPointTrendEnum.NoSignificantChange}
        />
      );

      expect(screen.getByTestId('arrow-right')).toBeInTheDocument();
      expect(screen.getByRole('paragraph')).toHaveTextContent(
        'No significant change'
      );
    });

    it('should render increasing trend without condition', () => {
      render(
        <TrendTag trendFromResponse={HealthDataPointTrendEnum.Increasing} />
      );

      expect(screen.getByTestId('arrow-up')).toBeInTheDocument();
      expect(screen.getByRole('paragraph')).toHaveTextContent('Increasing');
    });

    it('should render decreasing trend without condition', () => {
      render(
        <TrendTag trendFromResponse={HealthDataPointTrendEnum.Decreasing} />
      );

      expect(screen.getByTestId('arrow-down')).toBeInTheDocument();
      expect(screen.getByRole('paragraph')).toHaveTextContent('Decreasing');
    });

    it('should render trend not available', () => {
      render(
        <TrendTag
          trendFromResponse={HealthDataPointTrendEnum.CannotBeCalculated}
        />
      );
      expect(
        screen.queryByTestId('arrow', { exact: false })
      ).not.toBeInTheDocument();
      expect(screen.getByRole('paragraph')).toHaveTextContent(
        'No trend data available'
      );
    });
  });

  it('snapshot test', () => {
    const container = render(
      <TrendTag
        trendFromResponse={HealthDataPointTrendEnum.IncreasingAndGettingWorse}
      />
    );

    expect(container.asFragment()).toMatchSnapshot();
  });
});
