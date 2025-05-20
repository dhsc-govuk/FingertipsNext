import React from 'react';
import { render, screen } from '@testing-library/react';
import { DomContainer } from '@/components/molecules/Export/DomContainer';

describe('DomContainer', () => {
  it('renders an empty div when no data is provided', () => {
    render(<DomContainer />);
    const container = screen.getByTestId('domContainer');
    expect(container).toHaveTextContent('');
  });

  it('renders a provided HTML element', () => {
    const span = document.createElement('span');
    span.textContent = 'Test content';

    render(<DomContainer data={span} />);
    const container = screen.getByTestId('domContainer');
    expect(container).toContainElement(span);
    expect(container).toHaveTextContent('Test content');
  });

  it('clears the div when data is removed', () => {
    const { rerender } = render(<DomContainer />);
    const div = document.createElement('div');
    div.textContent = 'Hello';
    rerender(<DomContainer data={div} />);
    const container = screen.getByTestId('domContainer');
    expect(container).toHaveTextContent('Hello');

    rerender(<DomContainer data={undefined} />);
    expect(container).toHaveTextContent('');
  });
});
