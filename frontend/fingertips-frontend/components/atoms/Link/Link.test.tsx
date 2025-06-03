import { Link } from '@/components/atoms/Link/index';
import { render, screen } from '@testing-library/react';

describe('Link', () => {
  it('should render with expected content', () => {
    const linkText = 'Link text';
    const linkUrl = 'https://www.example.com';
    render(<Link href={linkUrl}>{linkText}</Link>);

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveTextContent(linkText);
    expect(link).toHaveAttribute('href', linkUrl);
  });
});
