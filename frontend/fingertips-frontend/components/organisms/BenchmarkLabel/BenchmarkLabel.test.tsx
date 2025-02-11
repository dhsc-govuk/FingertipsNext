import { render } from '@testing-library/react';
import {
  BenchmarkLabel,
  BenchmarkLabelGroupType,
  BenchmarkLabelType,
  getDefaultBenchmarkTagStyle,
} from '@/components/organisms/BenchmarkLabel/index';

describe('testing the function getBenchmarkLegendColourStyle', () => {
  test.each([
    [
      BenchmarkLabelGroupType.RAG,
      BenchmarkLabelType.LOWER,
      {
        backgroundColor: 'var(--other-light-blue, #5694CA)',
        color: 'var(--other-black, #0B0C0C)',
      },
    ],
    [
      BenchmarkLabelGroupType.QUINTILES,
      BenchmarkLabelType.LOWEST,
      {
        backgroundColor: '#E4DDFF',
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
      BenchmarkLabelGroupType.QUINTILES_WITH_VALUE,
      BenchmarkLabelType.WORST,
      {
        backgroundColor: '#D494C1',
        color: 'var(--other-black, #0B0C0C)',
      },
    ],
    [
      BenchmarkLabelGroupType.RAG,
      'unknown',
      {
        backgroundColor: 'transparent',
        border: '1px solid #0B0C0C',
        color: 'var(--other-black, #0B0C0C)',
      },
    ],
  ])(
    'returns correct style for %s group and %s type',
    (group, type,  expected) => {
      const result = getDefaultBenchmarkTagStyle(
        group as BenchmarkLabelGroupType,
        type as BenchmarkLabelType
      );
      expect(result).toEqual(expected);
    }
  );
});
/* The component test for the UI */

describe('Testing the BenchmarkLabel Component ', () => {
  test('renders with default props', () => {
    const { getByText } = render(<BenchmarkLabel />);
    expect(getByText('Not compared')).toBeInTheDocument();
  });

  test('renders with a specified type and group', () => {
    const { getByText } = render(
      <BenchmarkLabel
        type={BenchmarkLabelType.BETTER}
        group={BenchmarkLabelGroupType.RAG}
      />
    );
    expect(getByText('Better (95%)')).toBeInTheDocument();
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
