import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { ErrorPage } from '.';

describe('Error Page', () => {
  const errorText = 'test error text';
  const errorLink = '/test-link';
  const errorLinkText = 'test error link text';

  test('should render elements', () => {
    render(
      <ErrorPage
        errorText={errorText}
        errorLink={errorLink}
        errorLinkText={errorLinkText}
      />
    );

    expect(screen.getByText(/test error text/i)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'test error link text' })
    ).toHaveAttribute('href', '/test-link');
  });

  test('snapshot test', () => {
    const container = render(
      <ErrorPage
        errorText={errorText}
        errorLink={errorLink}
        errorLinkText={errorLinkText}
      />
    );

    expect(container.asFragment()).toMatchSnapshot();
  });
});
