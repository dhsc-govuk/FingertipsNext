import React, { createRef } from 'react';
import { InViewTrigger } from '@/components/hooks/InViewTrigger';
import { render, screen } from '@testing-library/react';

describe('InViewTrigger', () => {
  it('should set a reference on the element', () => {
    const ref = createRef<HTMLDivElement | null>();
    render(<InViewTrigger triggerRef={ref} />);
    expect(ref.current).not.toBeNull();
    expect(screen.queryByText(/^More\.\.\.$/)).not.toBeInTheDocument();
  });

  it('should say more...', () => {
    const ref = createRef<HTMLDivElement | null>();
    render(<InViewTrigger triggerRef={ref} more />);
    expect(screen.queryByText(/^More\.\.\.$/)).toBeInTheDocument();
  });
});
