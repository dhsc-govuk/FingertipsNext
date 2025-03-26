import { render, fireEvent } from '@testing-library/react';
import { ArrowToggleButton } from './index';

describe('ArrowToggleButton', () => {
  test('calls onToggle callback if provided', () => {
    const onToggleMock = jest.fn();
    const { getByTestId } = render(
      <ArrowToggleButton onToggle={onToggleMock} />
    );

    fireEvent.click(getByTestId('arrow-toggle-button'));
    expect(onToggleMock).toHaveBeenCalledTimes(1);
    expect(onToggleMock).toHaveBeenCalledWith(true);
  });
});
