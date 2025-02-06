import { render } from '@testing-library/react';
import {
  LegendLabel,
  LegendLabelGroupType,
  LegendLabelType,
  getBenchmarkLegendColourStyle,
} from './LegendLabel';

describe('testing the function getBenchmarkLegendColourStyle', () => {
  test('returns correct style for RAG group and HIGH type', () => {
    const result = getBenchmarkLegendColourStyle(
      LegendLabelGroupType.RAG,
      LegendLabelType.HIGH
    );
    expect(result).toEqual({
      backgroundColor: 'var(--other-dark-blue, #003078)',
      color: 'var(--other-white, #FFF)',
    });
  });

  test('returns correct style for RAG group and LOWER type', () => {
    const result = getBenchmarkLegendColourStyle(
      LegendLabelGroupType.RAG,
      LegendLabelType.LOWER
    );
    expect(result).toEqual({
      backgroundColor: 'var(--other-light-blue, #5694CA)',
      color: 'var(--other-black, #0B0C0C)',
    });
  });

  test('returns correct style for QUINTILE group and LOWEST type', () => {
    const result = getBenchmarkLegendColourStyle(
      LegendLabelGroupType.QUINTILE,
      LegendLabelType.LOWEST
    );
    expect(result).toEqual({
      backgroundColor: '#E4DDFF',
      color: 'var(--other-black, #0B0C0C)',
    });
  });

  test('returns correct style for QUINTILE group and HIGH type', () => {
    const result = getBenchmarkLegendColourStyle(
      LegendLabelGroupType.QUINTILE,
      LegendLabelType.HIGH
    );
    expect(result).toEqual({
      backgroundColor: '#8B60E2',
      color: 'var(--other-white, #FFF)',
    });
  });

  test('returns correct style for OTHERS group and WORST type', () => {
    const result = getBenchmarkLegendColourStyle(
      LegendLabelGroupType.OTHERS,
      LegendLabelType.WORST
    );
    expect(result).toEqual({
      backgroundColor: '#D494C1',
      color: 'var(--other-black, #0B0C0C)',
    });
  });

  test('returns default style when group is RAG and type is unknown', () => {
    const result = getBenchmarkLegendColourStyle(
      LegendLabelGroupType.RAG,
      'unknown' as LegendLabelType
    );
    expect(result).toEqual({
      backgroundColor: 'transparent',
      color: 'var(--other-black, #0B0C0C)',
      border: '1px solid #000',
    });
  });

  test('returns default style when group is not provided', () => {
    const result = getBenchmarkLegendColourStyle(
      undefined,
      LegendLabelType.BETTER
    );
    expect(result).toEqual({
      backgroundColor: '#812972',
      color: 'var(--other-white, #FFF)',
    }); // Default to OTHERS group
  });
});

/* The component test for the UI */

describe('Testing the LegendLabel Component ', () => {
  test('renders with default props', () => {
    const { getByText } = render(<LegendLabel label="Test Label" />);
    expect(getByText('Test Label')).toBeInTheDocument();
  });

  test('renders with a specified type and group', () => {
    const { getByText } = render(
      <LegendLabel
        label="Custom Label"
        type={LegendLabelType.BETTER}
        group={LegendLabelGroupType.RAG}
      />
    );
    expect(getByText('Custom Label')).toBeInTheDocument();
  });

  test('applies correct styles for RAG group and HIGH type', () => {
    const { container } = render(
      <LegendLabel
        label="Styled Label"
        type={LegendLabelType.HIGH}
        group={LegendLabelGroupType.RAG}
      />
    );
    expect(container.firstChild).toHaveStyle(
      'background-color: var(--other-dark-blue, #003078)'
    );
  });

  test('applies correct styles for QUINTILE group and LOW type', () => {
    const { container } = render(
      <LegendLabel
        label="Quintile Label"
        type={LegendLabelType.LOW}
        group={LegendLabelGroupType.QUINTILE}
      />
    );
    expect(container.firstChild).toHaveStyle('background-color: #CBBEF4');
  });

  test('applies correct styles for OTHERS group and WORST type', () => {
    const { container } = render(
      <LegendLabel
        label="Others Label"
        type={LegendLabelType.WORST}
        group={LegendLabelGroupType.OTHERS}
      />
    );
    expect(container.firstChild).toHaveStyle('background-color: #D494C1');
  });
});
