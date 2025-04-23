// ArrowExpander.test.tsx
'use client';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ArrowExpander } from './index';

describe('ArrowExpander', () => {
  it('should show "Show" and not show child content when open prop is not provided defaulted to false', () => {
    const contentText = 'Expandable content';
    render(
      <ArrowExpander fill="#ff0000" openTitle="Show" closeTitle="Hide">
        <div>{contentText}</div>
      </ArrowExpander>
    );

    expect(screen.queryByText('Hide')).not.toBeInTheDocument();
    expect(screen.getByText('Show')).toBeInTheDocument();
    expect(screen.queryByText(contentText)).not.toBeInTheDocument();
  });

  it('should show "Hide" and show child content when open prop is provided as true', () => {
    const contentText = 'Expandable content';
    render(
      <ArrowExpander
        fill="#ff0000"
        openTitle="Show"
        closeTitle="Hide"
        open={true}
      >
        <div>{contentText}</div>
      </ArrowExpander>
    );

    expect(screen.getByText('Hide')).toBeInTheDocument();
    expect(screen.queryByText('Show')).not.toBeInTheDocument();
    expect(screen.getByText(contentText)).toBeInTheDocument();
  });

  it('should call toggle the view when the title is clicked', async () => {
    const contentText = 'Expandable content';
    render(
      <ArrowExpander fill="#ff0000" openTitle="Show" closeTitle="Hide">
        <div>{contentText}</div>
      </ArrowExpander>
    );

    expect(screen.queryByText('Hide')).not.toBeInTheDocument();
    expect(screen.getByText('Show')).toBeInTheDocument();
    expect(screen.queryByText(contentText)).not.toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(screen.getByText('Show'));

    expect(screen.getByText('Hide')).toBeInTheDocument();
    expect(screen.queryByText('Show')).not.toBeInTheDocument();
    expect(screen.getByText(contentText)).toBeInTheDocument();
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
