import { render } from '@testing-library/react';
import {
  BenchmarkLabel,
  BenchmarkLabelGroupType,
  BenchmarkLabelType,
  getBenchmarkLabelStyle,
} from "@/components/organisms/BenchmarkLabel/index"

describe('testing the function getBenchmarkLegendColourStyle', () => {

  test('returns correct style for RAG group and LOWER type', () => {
    const result = getBenchmarkLabelStyle(
      BenchmarkLabelGroupType.RAG,
      BenchmarkLabelType.LOWER
    );
    expect(result).toEqual({
      backgroundColor: 'var(--other-light-blue, #5694CA)',
      color: 'var(--other-black, #0B0C0C)',
    });
  });

  test('returns correct style for QUINTILE group and LOWEST type', () => {
    const result = getBenchmarkLabelStyle(
      BenchmarkLabelGroupType.QUINTILES,
      BenchmarkLabelType.LOWEST
    );
    expect(result).toEqual({
      backgroundColor: '#E4DDFF',
      color: 'var(--other-black, #0B0C0C)',
    });
  });

  test('returns correct style for QUINTILE group and HIGHER type', () => {
    const result = getBenchmarkLabelStyle(
      BenchmarkLabelGroupType.QUINTILES,
      BenchmarkLabelType.HIGHER
    );

    expect(result).toEqual({
      backgroundColor: 'var(--other-dark-blue, #003078)',
      color: 'var(--other-white, #FFF)',
    });
  });

  test('returns correct style for OTHERS group and WORST type', () => {
    const result = getBenchmarkLabelStyle(
      BenchmarkLabelGroupType.QUINTILES_WITH_VALUE,
      BenchmarkLabelType.WORST
    );
    expect(result).toEqual({
      backgroundColor: '#D494C1',
      color: 'var(--other-black, #0B0C0C)',
    });
  });

  test('returns default style when group is RAG and type is unknown', () => {
    const result = getBenchmarkLabelStyle(
      BenchmarkLabelGroupType.RAG,
      'unknown'
    );
    expect(result).toEqual({
      backgroundColor: 'transparent',
      color: 'var(--other-black, #0B0C0C)',
      border: '1px solid #000',
    });
  });

  test('returns default style when group is not provided', () => {
    const result = getBenchmarkLabelStyle(undefined, BenchmarkLabelType.BETTER);
    expect(result).toEqual({
      backgroundColor: '#812972',
      color: 'var(--other-white, #FFF)',
    }); 
  });
});

/* The component test for the UI */

describe('Testing the BenchmarkLabel Component ', () => {
  test('renders with default props', () => {
    const { getByText } = render(<BenchmarkLabel label="Test Label" />);
    expect(getByText('Test Label')).toBeInTheDocument();
  });

  test('renders with a specified type and group', () => {
    const { getByText } = render(
      <BenchmarkLabel
        label="Custom Label"
        type={BenchmarkLabelType.BETTER}
        group={BenchmarkLabelGroupType.RAG}
      />
    );
    expect(getByText('Custom Label')).toBeInTheDocument();
  });

  test('applies correct styles for RAG group and HIGH type', () => {
    const { container } = render(
      <BenchmarkLabel
        label="Styled Label"
        type={BenchmarkLabelType.HIGHER}
        group={BenchmarkLabelGroupType.RAG}
      />
    );

    expect(container.firstChild).toHaveStyle(
      'background-color: var(--other-dark-blue, #003078)'
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
});
