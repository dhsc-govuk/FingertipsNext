import { render } from '@testing-library/react';
import { BenchmarkLabel } from '@/components/organisms/BenchmarkLabel/index';
import { QuintileColours } from '@/lib/styleHelpers/colours';

import { getBenchmarkTagStyle } from '@/components/organisms/BenchmarkLabel/BenchmarkLabelConfig';
import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';

describe('testing the function getBenchmarkLegendColourStyle', () => {
  test.each([
    [
      BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
      BenchmarkOutcome.Better,
      IndicatorPolarity.HighIsGood,
      {
        backgroundColor: '#00703C',
        tint: 'SOLID',
      },
    ],

    [
      BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
      BenchmarkOutcome.Similar,
      IndicatorPolarity.HighIsGood,
      {
        backgroundColor: '#FFDD00',
        color: '#0B0C0C',
      },
    ],

    [
      BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
      BenchmarkOutcome.Worse,
      IndicatorPolarity.HighIsGood,
      {
        backgroundColor: '#D4351C',
        tint: 'SOLID',
      },
    ],
    [
      BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
      BenchmarkOutcome.Lower,
      IndicatorPolarity.NoJudgement,
      {
        backgroundColor: '#5694CA',
      },
    ],

    [
      BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
      BenchmarkOutcome.Higher,
      IndicatorPolarity.NoJudgement,
      {
        backgroundColor: '#003078',
        tint: 'SOLID',
      },
    ],
    [
      BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
      BenchmarkOutcome.NotCompared,
      IndicatorPolarity.Unknown,
      {
        backgroundColor: 'transparent',
        color: '#0B0C0C',
        border: '1px solid #0B0C0C',
      },
    ],
    [
      BenchmarkComparisonMethod.Quintiles,
      BenchmarkOutcome.Lowest,
      IndicatorPolarity.NoJudgement,
      {
        backgroundColor: QuintileColours.Lowest,
        color: '#0B0C0C',
      },
    ],
    [
      BenchmarkComparisonMethod.Quintiles,
      BenchmarkOutcome.Low,
      IndicatorPolarity.NoJudgement,
      {
        backgroundColor: '#CBBEF4',
        color: '#0B0C0C',
      },
    ],
    [
      BenchmarkComparisonMethod.Quintiles,
      BenchmarkOutcome.Middle,
      IndicatorPolarity.NoJudgement,
      {
        backgroundColor: '#AA90EC',
        color: '#0B0C0C',
      },
    ],
    [
      BenchmarkComparisonMethod.Quintiles,
      BenchmarkOutcome.High,
      IndicatorPolarity.NoJudgement,
      {
        backgroundColor: '#8B60E2',
        tint: 'SOLID',
      },
    ],
    [
      BenchmarkComparisonMethod.Quintiles,
      BenchmarkOutcome.Highest,
      IndicatorPolarity.NoJudgement,
      {
        backgroundColor: '#6B33C3',
        tint: 'SOLID',
      },
    ],
    [
      BenchmarkComparisonMethod.Quintiles,
      BenchmarkOutcome.Worst,
      IndicatorPolarity.HighIsGood,
      {
        backgroundColor: '#D494C1',
        color: '#0B0C0C',
      },
    ],
    [
      BenchmarkComparisonMethod.Quintiles,
      BenchmarkOutcome.Worse,
      IndicatorPolarity.HighIsGood,
      {
        backgroundColor: '#BC6AAA',
        color: '#0B0C0C',
      },
    ],
    [
      BenchmarkComparisonMethod.Quintiles,
      BenchmarkOutcome.Middle,
      IndicatorPolarity.HighIsGood,
      {
        backgroundColor: '#A44596',
        tint: 'SOLID',
      },
    ],
    [
      BenchmarkComparisonMethod.Quintiles,
      BenchmarkOutcome.Better,
      IndicatorPolarity.HighIsGood,
      {
        backgroundColor: '#812972',
        tint: 'SOLID',
      },
    ],
    [
      BenchmarkComparisonMethod.Quintiles,
      BenchmarkOutcome.Best,
      IndicatorPolarity.HighIsGood,
      {
        backgroundColor: '#561950',
        tint: 'SOLID',
      },
    ],
  ])(
    'returns correct style for %s group and %s type with %s',
    (group, type, polarity, expected) => {
      const result = getBenchmarkTagStyle(
        group as BenchmarkComparisonMethod,
        type as BenchmarkOutcome,
        polarity as IndicatorPolarity
      );
      expect(result).toEqual(expected);
    }
  );
});
/* The component test for the UI */

describe('Testing the BenchmarkLabel Component', () => {
  test('renders with default props', () => {
    const { getByText, container } = render(<BenchmarkLabel />);
    expect(getByText('Not compared')).toBeInTheDocument();
    expect(container.firstChild).toHaveStyle('background-color:transparent');
    expect(container.firstChild).toHaveStyle('color:#0B0C0C');
  });

  test('renders with a specified type and group', () => {
    const { getByText } = render(
      <BenchmarkLabel
        outcome={BenchmarkOutcome.Better}
        method={BenchmarkComparisonMethod.CIOverlappingReferenceValue95}
        polarity={IndicatorPolarity.HighIsGood}
      />
    );
    expect(getByText('Better')).toBeInTheDocument();
  });

  test('applies correct styles for RAG group and HIGHER type', () => {
    const { container } = render(
      <BenchmarkLabel
        outcome={BenchmarkOutcome.Higher}
        method={BenchmarkComparisonMethod.CIOverlappingReferenceValue95}
        polarity={IndicatorPolarity.HighIsGood}
      />
    );

    expect(container.firstChild).toHaveStyle('background-color: #003078');
  });

  test('applies correct styles for QUINTILE group and LOW type', () => {
    const { container } = render(
      <BenchmarkLabel
        outcome={BenchmarkOutcome.Low}
        method={BenchmarkComparisonMethod.Quintiles}
        polarity={IndicatorPolarity.NoJudgement}
      />
    );
    expect(container.firstChild).toHaveStyle('background-color: #CBBEF4');
  });

  test('applies correct styles for OTHERS group and WORST type', () => {
    const { container } = render(
      <BenchmarkLabel
        outcome={BenchmarkOutcome.Worst}
        method={BenchmarkComparisonMethod.Quintiles}
        polarity={IndicatorPolarity.HighIsGood}
      />
    );
    expect(container.firstChild).toHaveStyle('background-color: #D494C1');
  });

  it('snapshot testing of the UI', () => {
    const container = render(
      <BenchmarkLabel
        outcome={BenchmarkOutcome.Worst}
        method={BenchmarkComparisonMethod.Quintiles}
        polarity={IndicatorPolarity.HighIsGood}
      />
    );
    expect(container.asFragment()).toMatchSnapshot();
  });
});
