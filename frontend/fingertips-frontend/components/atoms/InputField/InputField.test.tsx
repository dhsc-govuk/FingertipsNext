import { render, screen } from '@testing-library/react';
import { InputField } from '.';
import userEvent from '@testing-library/user-event';

describe('InputField', () => {
  it('should preserve any existing onChange handler', async () => {
    const user = userEvent.setup();
    const initialHandler = vi.fn();
    render(
      <InputField input={{ onChange: initialHandler }}>Input Field</InputField>
    );

    await user.type(screen.getByRole('textbox'), 'A');

    expect(initialHandler).toHaveBeenCalled();
  });

  it('should display character count if limit given', () => {
    render(<InputField characterLimit={10}>Input Field</InputField>);
    expect(
      screen.getByText('You have 10 characters remaining.')
    ).toBeInTheDocument();
  });

  it('should update character count on change', async () => {
    const user = userEvent.setup();
    const initialHandler = vi.fn();
    render(
      <InputField characterLimit={10} input={{ onChange: initialHandler }}>
        Input Field
      </InputField>
    );

    await user.type(screen.getByRole('textbox'), 'A');

    expect(initialHandler).toHaveBeenCalled();
    expect(
      screen.getByText('You have 9 characters remaining.')
    ).toBeInTheDocument();
  });
});
