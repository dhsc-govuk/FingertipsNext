import React from 'react';
import { render } from '@testing-library/react';
import { FocusOnFragment } from './FocusOnFragment';

vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(),
}));

vi.mock('@/context/LoaderContext', () => ({
  useLoadingState: vi.fn(),
}));

import { useSearchParams } from 'next/navigation';
import { useLoadingState } from '@/context/LoaderContext';

describe('FocusOnFragment', () => {
  let focusMock: vi.Mock;

  beforeEach(() => {
    focusMock = vi.fn();

    // Set window.location.hash
    Object.defineProperty(window, 'location', {
      value: {
        hash: '#test-element',
      },
      writable: true,
    });

    // Mock getElementById
    vi.spyOn(document, 'getElementById').mockImplementation((id) => {
      if (id === 'test-element') {
        return { focus: focusMock } as unknown as HTMLElement;
      }
      return null;
    });

    // Provide return values for mocks
    (useSearchParams as vi.Mock).mockReturnValue(new URLSearchParams());
    (useLoadingState as vi.Mock).mockReturnValue({});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('focuses element matching the hash', () => {
    render(<FocusOnFragment />);
    expect(focusMock).toHaveBeenCalled();
  });

  it('does nothing if no element matches', () => {
    (document.getElementById as vi.Mock).mockReturnValue(null);
    render(<FocusOnFragment />);
    expect(focusMock).not.toHaveBeenCalled();
  });

  it('does nothing if no hash', () => {
    window.location.hash = '';
    render(<FocusOnFragment />);
    expect(focusMock).not.toHaveBeenCalled();
  });
});
