import { render, screen } from '@testing-library/react';
import { BackLink } from '.';
import userEvent from '@testing-library/user-event';

describe('BackLink', () => {
  it('should render with expected content', () => {
    const linkUrl = 'https://www.example.com';
    const testId = 'test-id';
    render(<BackLink href={linkUrl} data-testid={testId} />);

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', linkUrl);
    expect(link).toHaveAttribute('data-testid', testId);
  });

  it('should call the onClick function when clicked', async () => {
    const clickFn = jest.fn();

    render(<BackLink href={'#'} onClick={clickFn} />);

    await userEvent.click(screen.getByRole('link'));

    expect(clickFn).toHaveBeenCalled();
  });
});
