import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
} from '@/generated-sources/ft-api-client';
import { BenchmarkPillText, BenchmarkPillTextProps } from './BenchmarkPillText';
import { englandAreaString } from '@/lib/chartHelpers/constants';
import { formatNumber } from '@/lib/numberFormatter';
import { render } from '@testing-library/react';

describe('benchmark pill text', () => {
  const defaultValue = 123;
  const formattedDefaultValue = formatNumber(defaultValue);

  const defaultProps: BenchmarkPillTextProps = {
    unitLabel: 'unit label',
    value: defaultValue,
    outcome: BenchmarkOutcome.Similar,
    benchmarkMethod: BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
    benchmarkAreaName: englandAreaString,
  };

  it('should return appropriate text if no value is given', () => {
    const screen = render(
      <BenchmarkPillText
        value={undefined}
        unitLabel={defaultProps.unitLabel}
        outcome={defaultProps.outcome}
        benchmarkMethod={defaultProps.benchmarkMethod}
        benchmarkAreaName={defaultProps.benchmarkAreaName}
      />
    );

    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('should return a formatted value with a space before the unit label for a non-percentage unit label', () => {
    const screen = render(
      <BenchmarkPillText
        value={defaultValue}
        unitLabel={defaultProps.unitLabel}
        outcome={defaultProps.outcome}
        benchmarkMethod={defaultProps.benchmarkMethod}
        benchmarkAreaName={defaultProps.benchmarkAreaName}
      />
    );

    expect(
      screen.getByText(`${formattedDefaultValue} ${defaultProps.unitLabel}`)
    ).toBeInTheDocument();
  });

  it('should return a formatted value without a space before the unit label when the unit label is %', () => {
    const screen = render(
      <BenchmarkPillText
        value={defaultValue}
        unitLabel={'%'}
        outcome={defaultProps.outcome}
        benchmarkMethod={defaultProps.benchmarkMethod}
        benchmarkAreaName={defaultProps.benchmarkAreaName}
      />
    );

    expect(screen.getByText(`${formattedDefaultValue}%`)).toBeInTheDocument();
  });

  it('should not return comparison text if it is the baseline benchmark', () => {
    const screen = render(
      <BenchmarkPillText
        value={defaultValue}
        unitLabel={defaultProps.unitLabel}
        outcome={'Baseline'}
        benchmarkMethod={defaultProps.benchmarkMethod}
        benchmarkAreaName={defaultProps.benchmarkAreaName}
      />
    );

    expect(screen.getAllByRole('paragraph')).toHaveLength(1);
    expect(screen.getByRole('paragraph')).toHaveTextContent(
      `${formattedDefaultValue} ${defaultProps.unitLabel}`
    );
  });

  it('should return "Not compared" if benchmark method is "Unknown"', () => {
    const screen = render(
      <BenchmarkPillText
        value={defaultValue}
        unitLabel={defaultProps.unitLabel}
        outcome={BenchmarkOutcome.Higher}
        benchmarkMethod={BenchmarkComparisonMethod.Unknown}
        benchmarkAreaName={defaultProps.benchmarkAreaName}
      />
    );

    expect(
      screen.getByText('Not compared', {
        exact: false,
      })
    ).toBeInTheDocument();
  });

  it('should return "Not compared" if benchmark outcome is "Not Compared"', () => {
    const screen = render(
      <BenchmarkPillText
        value={defaultValue}
        unitLabel={defaultProps.unitLabel}
        outcome={BenchmarkOutcome.NotCompared}
        benchmarkMethod={
          BenchmarkComparisonMethod.CIOverlappingReferenceValue95
        }
        benchmarkAreaName={defaultProps.benchmarkAreaName}
      />
    );

    expect(
      screen.getByText('Not compared', {
        exact: false,
      })
    ).toBeInTheDocument();
  });

  it.each([
    BenchmarkOutcome.Lowest,
    BenchmarkOutcome.Low,
    BenchmarkOutcome.Middle,
    BenchmarkOutcome.High,
    BenchmarkOutcome.Highest,
    BenchmarkOutcome.Worst,
    BenchmarkOutcome.Worse,
    BenchmarkOutcome.Middle,
    BenchmarkOutcome.Better,
    BenchmarkOutcome.Best,
  ])(
    'should return appropriate quintile description if comparison method is quintile',
    (outcome: BenchmarkOutcome) => {
      const screen = render(
        <BenchmarkPillText
          value={defaultValue}
          unitLabel={defaultProps.unitLabel}
          outcome={outcome}
          benchmarkMethod={BenchmarkComparisonMethod.Quintiles}
          benchmarkAreaName={defaultProps.benchmarkAreaName}
        />
      );

      expect(screen.getByText(`${outcome} quintile`)).toBeInTheDocument();
    }
  );

  it('should return appropriate comparison text if benchmark outcome is "Similar"', () => {
    const outcome = BenchmarkOutcome.Similar;
    const screen = render(
      <BenchmarkPillText
        value={defaultValue}
        unitLabel={defaultProps.unitLabel}
        outcome={outcome}
        benchmarkMethod={defaultProps.benchmarkMethod}
        benchmarkAreaName={defaultProps.benchmarkAreaName}
      />
    );

    expect(
      screen.getByText(`${outcome} to ${defaultProps.benchmarkAreaName}`, {
        exact: false,
      })
    ).toBeInTheDocument();
  });

  it.each([
    [BenchmarkComparisonMethod.CIOverlappingReferenceValue95, '(95%)'],
    [BenchmarkComparisonMethod.CIOverlappingReferenceValue99_8, '(99.8%)'],
  ])(
    'should affix correct confidence interval to comparison text',
    (method: BenchmarkComparisonMethod, expectedCI: string) => {
      const screen = render(
        <BenchmarkPillText
          value={defaultValue}
          unitLabel={defaultProps.unitLabel}
          outcome={BenchmarkOutcome.Similar}
          benchmarkMethod={method}
          benchmarkAreaName={defaultProps.benchmarkAreaName}
        />
      );

      expect(
        screen.getByText(
          `${BenchmarkOutcome.Similar} to ${defaultProps.benchmarkAreaName} ${expectedCI}`
        )
      ).toBeInTheDocument();
    }
  );

  it.each([
    BenchmarkOutcome.Better,
    BenchmarkOutcome.Worse,
    BenchmarkOutcome.Lower,
    BenchmarkOutcome.Higher,
  ])(
    'should return appropriate comparison text for other outcomes',
    (outcome: BenchmarkOutcome) => {
      const screen = render(
        <BenchmarkPillText
          value={defaultValue}
          unitLabel={defaultProps.unitLabel}
          outcome={outcome}
          benchmarkMethod={defaultProps.benchmarkMethod}
          benchmarkAreaName={defaultProps.benchmarkAreaName}
        />
      );

      expect(
        screen.getByText(`${outcome} than ${defaultProps.benchmarkAreaName}`, {
          exact: false,
        })
      ).toBeInTheDocument();
    }
  );
});
