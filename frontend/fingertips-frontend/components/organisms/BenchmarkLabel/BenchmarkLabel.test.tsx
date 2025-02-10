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
      'returns correct style for RAG group and LOWER type',
      BenchmarkLabelGroupType.RAG,
      BenchmarkLabelType.LOWER,
      {
        backgroundColor: 'var(--other-light-blue, #5694CA)',
        color: 'var(--other-black, #0B0C0C)',
      },
    ],
    [
      'returns correct style for QUINTILE group and LOWEST type',
      BenchmarkLabelGroupType.QUINTILES,
      BenchmarkLabelType.LOWEST,
      {
        backgroundColor: '#E4DDFF',
        color: 'var(--other-black, #0B0C0C)',
      },
    ],
    [
      'returns correct style for QUINTILE group and HIGH type',
      BenchmarkLabelGroupType.QUINTILES,
      BenchmarkLabelType.HIGH,
      {
        backgroundColor: '#8B60E2',
        tint: 'SOLID',
      },
    ],
    [
      'returns correct style for OTHERS group and WORST type',
      BenchmarkLabelGroupType.QUINTILES_WITH_VALUE,
      BenchmarkLabelType.WORST,
      {
        backgroundColor: '#D494C1',
        color: 'var(--other-black, #0B0C0C)',
      },
    ],
    [
      'returns default style when group is RAG and type is unknown',
      BenchmarkLabelGroupType.RAG,
      'unknown',
      {
        backgroundColor: 'transparent',
        color: 'var(--other-black, #0B0C0C)',
      },
    ],
    [
      'returns default style when group is not provided',
      undefined,
      BenchmarkLabelType.BETTER,
      {
        backgroundColor: '#812972',
        tint: 'SOLID',
      },
    ],
  ])('%s', (_, group, type, expected) => {
    const result = getDefaultBenchmarkTagStyle(group, type as BenchmarkLabelType);
    expect(result).toEqual(expected);
  });
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

  test('applies correct styles for RAG group and HIGH type', () => {
    const { container } = render(
      <BenchmarkLabel
        type={BenchmarkLabelType.HIGHER}
        group={BenchmarkLabelGroupType.RAG}
      />
    );

    expect(container.firstChild).toHaveStyle(
      'background-color: rgb(29, 112, 184)'
    );
  });

  test('applies correct styles for QUINTILE group and LOW type', () => {
    const { container } = render(
      <BenchmarkLabel
        label="Quintile Label"
        type={BenchmarkLabelType.LOW}
        group={BenchmarkLabelGroupType.QUINTILES}
      />
    );
    expect(container.firstChild).toHaveStyle('background-color: #CBBEF4');
  });

  test('applies correct styles for OTHERS group and WORST type', () => {
    const { container } = render(
      <BenchmarkLabel
        label="Others Label"
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
