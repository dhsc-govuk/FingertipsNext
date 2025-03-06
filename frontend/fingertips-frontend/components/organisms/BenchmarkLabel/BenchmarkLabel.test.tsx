import { render } from '@testing-library/react';
import { BenchmarkLabel } from '@/components/organisms/BenchmarkLabel/index';
import { QuintileColours } from '@/lib/styleHelpers/colours';
import {
  BenchmarkLabelGroupType,
  BenchmarkLabelType,
} from './BenchmarkLabelTypes';
import { getDefaultBenchmarkTagStyle } from '@/components/organisms/BenchmarkLabel/BenchmarkLabelConfig';

describe('testing the function getBenchmarkLegendColourStyle', () => {
  test.each([
    [
      BenchmarkLabelGroupType.RAG,
      BenchmarkLabelType.BETTER,
      {
        backgroundColor: 'var(--other-green, #00703C)',
        tint: 'SOLID',
      },
    ],

    [
      BenchmarkLabelGroupType.RAG,
      BenchmarkLabelType.SIMILAR,
      {
        backgroundColor: 'var(--other-yellow, #FFDD00)',
        color: 'var(--other-black, #0B0C0C)',
      },
    ],

    [
      BenchmarkLabelGroupType.RAG,
      BenchmarkLabelType.WORSE,
      {
        backgroundColor: 'var(--other-red, #D4351C)',
        tint: 'SOLID',
      },
    ],
    [
      BenchmarkLabelGroupType.RAG,
      BenchmarkLabelType.LOWER,
      {
        backgroundColor: 'var(--other-light-blue, #5694CA)',
      },
    ],

    [
      BenchmarkLabelGroupType.RAG,
      BenchmarkLabelType.HIGHER,
      {
        backgroundColor: '#003078',
        tint: 'SOLID',
      },
    ],
    [
      BenchmarkLabelGroupType.RAG,
      BenchmarkLabelType.NOT_COMPARED,
      {
        backgroundColor: 'transparent',
        color: '#0B0C0C',
        border: '1px solid #0B0C0C',
      },
    ],
    [
      BenchmarkLabelGroupType.QUINTILES,
      BenchmarkLabelType.LOWEST,
      {
        backgroundColor: QuintileColours.Lowest,
        color: 'var(--other-black, #0B0C0C)',
      },
    ],
    [
      BenchmarkLabelGroupType.QUINTILES,
      BenchmarkLabelType.LOW,
      {
        backgroundColor: '#CBBEF4',
        color: 'var(--other-black, #0B0C0C)',
      },
    ],
    [
      BenchmarkLabelGroupType.QUINTILES,
      BenchmarkLabelType.MIDDLE,
      {
        backgroundColor: '#AA90EC',
        color: 'var(--other-black, #0B0C0C)',
      },
    ],
    [
      BenchmarkLabelGroupType.QUINTILES,
      BenchmarkLabelType.HIGH,
      {
        backgroundColor: '#8B60E2',
        tint: 'SOLID',
      },
    ],
    [
      BenchmarkLabelGroupType.QUINTILES,
      BenchmarkLabelType.HIGHEST,
      {
        backgroundColor: '#6B33C3',
        tint: 'SOLID',
      },
    ],
    [
      BenchmarkLabelGroupType.QUINTILES_WITH_VALUE,
      BenchmarkLabelType.WORST,
      {
        backgroundColor: '#D494C1',
        color: 'var(--other-black, #0B0C0C)',
      },
    ],
    [
      BenchmarkLabelGroupType.QUINTILES_WITH_VALUE,
      BenchmarkLabelType.WORSE,
      {
        backgroundColor: '#BC6AAA',
        color: 'var(--other-black, #0B0C0C)',
      },
    ],
    [
      BenchmarkLabelGroupType.QUINTILES_WITH_VALUE,
      BenchmarkLabelType.MIDDLE,
      {
        backgroundColor: '#A44596',
        tint: 'SOLID',
      },
    ],
    [
      BenchmarkLabelGroupType.QUINTILES_WITH_VALUE,
      BenchmarkLabelType.BETTER,
      {
        backgroundColor: '#812972',
        tint: 'SOLID',
      },
    ],
    [
      BenchmarkLabelGroupType.QUINTILES_WITH_VALUE,
      BenchmarkLabelType.BEST,
      {
        backgroundColor: '#561950',
        tint: 'SOLID',
      },
    ],
  ])(
    'returns correct style for %s group and %s type',
    (group, type, expected) => {
      const result = getDefaultBenchmarkTagStyle(
        group as BenchmarkLabelGroupType,
        type as BenchmarkLabelType
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
        type={BenchmarkLabelType.BETTER}
        group={BenchmarkLabelGroupType.RAG}
      />
    );
    expect(getByText('Better')).toBeInTheDocument();
  });

  test('applies correct styles for RAG group and HIGHER type', () => {
    const { container } = render(
      <BenchmarkLabel
        type={BenchmarkLabelType.HIGHER}
        group={BenchmarkLabelGroupType.RAG}
      />
    );

    expect(container.firstChild).toHaveStyle('background-color: #003078');
  });

  test('applies correct styles for QUINTILE group and LOW type', () => {
    const { container } = render(
      <BenchmarkLabel
        type={BenchmarkLabelType.LOW}
        group={BenchmarkLabelGroupType.QUINTILES}
      />
    );
    expect(container.firstChild).toHaveStyle('background-color: #CBBEF4');
  });

  test('applies correct styles for OTHERS group and WORST type', () => {
    const { container } = render(
      <BenchmarkLabel
        type={BenchmarkLabelType.WORST}
        group={BenchmarkLabelGroupType.QUINTILES_WITH_VALUE}
      />
    );
    expect(container.firstChild).toHaveStyle('background-color: #D494C1');
  });

  it('snapshot testing of the UI', () => {
    const container = render(
      <BenchmarkLabel
        type={BenchmarkLabelType.WORST}
        group={BenchmarkLabelGroupType.QUINTILES_WITH_VALUE}
      />
    );
    expect(container.asFragment()).toMatchSnapshot();
  });
});
