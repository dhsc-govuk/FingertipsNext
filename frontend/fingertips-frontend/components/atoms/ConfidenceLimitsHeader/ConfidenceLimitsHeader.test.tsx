import { render, screen } from '@testing-library/react';
import { ConfidenceLimitsHeader } from '@/components/atoms/ConfidenceLimitsHeader/ConfidenceLimitsHeader';

describe('ConfidenceLimitsHeader', () => {
  it('renders correctly when confidenceLimit is provided', () => {
    render(<ConfidenceLimitsHeader confidenceLimit={95} />);

    expect(screen.getByText(/95%/)).toBeInTheDocument();
    expect(screen.getByText(/confidence/i)).toBeInTheDocument();
    expect(screen.getByText(/limits/i)).toBeInTheDocument();
  });

  it('renders nothing when confidenceLimit is undefined', () => {
    const { container } = render(<ConfidenceLimitsHeader />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when confidenceLimit is 0', () => {
    const { container } = render(
      <ConfidenceLimitsHeader confidenceLimit={0} />
    );
    expect(container).toBeEmptyDOMElement();
  });
});
