import { TopNavLink } from '@/components/atoms/TopNavLink/index';
import { render, screen } from '@testing-library/react';

describe('TopNavLink', () => {
  it('should render with expected content', () => {
    const linkText = 'Link text';
    const linkUrl = 'https://www.example.com';
    render(<TopNavLink href={linkUrl}>{linkText}</TopNavLink>);

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveTextContent(linkText);
    expect(link).toHaveAttribute('href', linkUrl);
  });

  it('should match the snapshot', () => {
    const topNavLink = render(<TopNavLink href={'#'}>Link text</TopNavLink>);

    expect(topNavLink.asFragment()).toMatchSnapshot();
  });
});
