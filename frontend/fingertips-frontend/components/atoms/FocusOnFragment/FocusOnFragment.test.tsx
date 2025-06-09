import React from 'react';
import { render } from '@testing-library/react';
import { FocusOnFragment } from './FocusOnFragment';

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}));

jest.mock('@/context/LoaderContext', () => ({
  useLoadingState: jest.fn(),
}));

import { useSearchParams } from 'next/navigation';
import { useLoadingState } from '@/context/LoaderContext';

describe('FocusOnFragment', () => {
  let focusMock: jest.Mock;

  beforeEach(() => {
    focusMock = jest.fn();

    // Set window.location.hash
    Object.defineProperty(window, 'location', {
      value: {
        hash: '#test-element',
      },
      writable: true,
    });

    // Mock getElementById
    jest.spyOn(document, 'getElementById').mockImplementation((id) => {
      if (id === 'test-element') {
        return { focus: focusMock } as unknown as HTMLElement;
      }
      return null;
    });

    // Provide return values for mocks
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());
    (useLoadingState as jest.Mock).mockReturnValue({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('focuses element matching the hash', () => {
    render(<FocusOnFragment />);
    expect(focusMock).toHaveBeenCalled();
  });

  it('does nothing if no element matches', () => {
    (document.getElementById as jest.Mock).mockReturnValue(null);
    render(<FocusOnFragment />);
    expect(focusMock).not.toHaveBeenCalled();
  });

  it('does nothing if no hash', () => {
    window.location.hash = '';
    render(<FocusOnFragment />);
    expect(focusMock).not.toHaveBeenCalled();
  });
});
