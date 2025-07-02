import { render, screen } from '@testing-library/react';
import { FTFooter } from '.';

describe('FTFooter', () => {
  it('should match snapshot', () => {
    const container = render(<FTFooter tag={'0.0.0'} hash={'12345678'} />);
    expect(container.asFragment()).toMatchSnapshot();
  });

  it('should have className "chart-page-footer" when chartPage is true', () => {
    render(<FTFooter tag="vXYZ" hash="ABCD" chartPage={true} />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass('chart-page-footer');
  });

  it('should not have className "chart-page-footer" when chartPage is false', () => {
    render(<FTFooter tag="vXYZ" hash="ABCD" chartPage={false} />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).not.toHaveClass('chart-page-footer');
  });

  it('should render the project version', () => {
    render(<FTFooter tag={'vXYZ'} hash={'ABCD'} />);
    const version = screen.getByTestId('project-version');
    expect(version).toBeInTheDocument();
  });
});
