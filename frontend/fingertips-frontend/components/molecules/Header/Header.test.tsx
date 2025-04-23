import { render, screen } from '@testing-library/react';
import { FTHeader } from '.';
import { expect } from '@jest/globals';

describe('Header', () => {
  it('should match snapshot', () => {
    const container = render(<FTHeader />);

    expect(container.asFragment()).toMatchSnapshot();
  });

  it('should render Access public health data as a link', async () => {
    render(<FTHeader />);
    const returnToHomePageLink = screen.getByRole('link', {
      name: /Access public health data/i,
    });

    expect(returnToHomePageLink).toBeInTheDocument();
    expect(returnToHomePageLink).toHaveAttribute('href', '/');
  });
});
