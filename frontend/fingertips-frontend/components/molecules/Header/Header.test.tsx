// MUST BE AT THE TOP DUE TO HOISTING OF MOCKED MODULES
import { mockSetIsLoading } from '@/mock/utils/mockUseLoadingState';
//
import { render, screen } from '@testing-library/react';
import { FTHeader } from '.';

vi.mock('next-auth/react', () => {
  return { getSession: vi.fn() };
});

vi.mock('@/lib/auth/handlers', () => {
  return {
    signInHandler: vi.fn(),
    signOutHandler: vi.fn(),
  };
});

mockSetIsLoading.mockReturnValue(false);

describe('Header', () => {
  it('should match snapshot', () => {
    const container = render(<FTHeader />);

    expect(container.asFragment()).toMatchSnapshot();
  });

  it('should have className "chart-page-header" when chartPage is true', () => {
    render(<FTHeader chartPage={true} />);

    const header = screen.getByRole('banner');

    expect(header).toHaveClass('chart-page-header');
  });

  it('should not have className "chart-page-header" when chartPage is false', () => {
    render(<FTHeader chartPage={false} />);

    const header = screen.getByRole('banner');

    expect(header).not.toHaveClass('chart-page-header');
  });

  it('should render Find public health data as a link', async () => {
    render(<FTHeader />);
    const returnToHomePageLink = screen.getByRole('link', {
      name: /Find public health data/i,
    });

    expect(returnToHomePageLink).toBeInTheDocument();
    expect(returnToHomePageLink).toHaveAttribute('href', '/');
  });
});
