import { render } from '@testing-library/react';
import { ArrowToggleButton } from './index';

describe('ArrowToggleButton', () => {
  test('calls onToggle callback if provided', () => {
    const { getByTestId } = render(<ArrowToggleButton isOpen={true} />);

    expect(getByTestId('arrow-toggle-button')).toBeInTheDocument();
  });
});
