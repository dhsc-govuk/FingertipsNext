import React from 'react';
import { render } from '@testing-library/react';
import { FocusOnFragment } from './FocusOnFragment';
import { useSearchParams } from 'next/navigation';
import { useLoadingState } from '@/context/LoaderContext';
import { Mock } from 'vitest';

vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(),
}));

vi.mock('@/context/LoaderContext', () => ({
  useLoadingState: vi.fn(),
}));

describe('FocusOnFragment', () => {
  let focusMock: Mock;

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
    (useSearchParams as Mock).mockReturnValue(new URLSearchParams());
    (useLoadingState as Mock).mockReturnValue({});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('focuses element matching the hash', () => {
    render(<FocusOnFragment />);
    expect(focusMock).toHaveBeenCalled();
  });

  it('does nothing if no element matches', () => {
    (document.getElementById as Mock).mockReturnValue(null);
    render(<FocusOnFragment />);
    expect(focusMock).not.toHaveBeenCalled();
  });

  it('does nothing if no hash', () => {
    window.location.hash = '';
    render(<FocusOnFragment />);
    expect(focusMock).not.toHaveBeenCalled();
  });
});
