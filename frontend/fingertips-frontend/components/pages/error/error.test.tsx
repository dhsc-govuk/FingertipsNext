import { render, screen } from '@testing-library/react';

import { ErrorPage } from '.';

describe('Error Page', () => {
  it('snapshot test', () => {
    const container = render(<ErrorPage />);

    expect(container.asFragment()).toMatchSnapshot();
  });

  it('displays custom title and message', () => {
    const expectedHeading = 'Custom Error Page Title';
    const expectedMessage = 'Custom error message.';

    render(<ErrorPage title={expectedHeading} description={expectedMessage} />);

    expect(
      screen.getByRole('heading', { name: expectedHeading })
    ).toBeVisible();
    expect(screen.getAllByRole('paragraph')[0]).toHaveTextContent(
      expectedMessage
    );
  });
});
