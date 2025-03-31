// ArrowExpander.test.tsx
'use client';
import React, { act } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ArrowExpander } from './index';

describe('ArrowExpander', () => {
  it('should show "Hide" initially and then toggle to "Show" with content when clicked', () => {
    const contentText = 'Expandable content';
    render(
      <ArrowExpander fill="#ff0000" openTitle="Show" closeTitle="Hide">
        <div>{contentText}</div>
      </ArrowExpander>
    );

    expect(screen.getByText('Show')).toBeInTheDocument();
    expect(screen.queryByText(contentText)).not.toBeInTheDocument();

    expect(screen.getByText('Show')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('arrow-toggle-button'));

    expect(screen.getByText('Hide')).toBeInTheDocument();
    expect(screen.getByText(contentText)).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('arrow-toggle-button'));
    expect(screen.getByText('Show')).toBeInTheDocument();
  });

  it('take a snapshot', () => {
    const container = render(
      <ArrowExpander fill="#ff0000">
        <div> Collapse panel</div>
      </ArrowExpander>
    );
    expect(container.asFragment()).toMatchSnapshot();
  });
});
