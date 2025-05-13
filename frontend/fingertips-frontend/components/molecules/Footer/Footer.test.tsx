import { render, screen } from '@testing-library/react';
import { FTFooter } from '.';
import { expect } from '@jest/globals';

describe('FTFooter', () => {
  it('should match snapshot', () => {
    process.env.NEXT_PUBLIC_FINGERTIPS_GIT_TAG = '0.0.0';
    process.env.NEXT_PUBLIC_FINGERTIPS_GIT_HASH = '12345678';
    const container = render(<FTFooter />);
    expect(container.asFragment()).toMatchSnapshot();
  });

  it('should render the project version', () => {
    process.env.NEXT_PUBLIC_FINGERTIPS_GIT_TAG = 'vXYZ';
    process.env.NEXT_PUBLIC_FINGERTIPS_GIT_HASH = 'ABCD';
    render(<FTFooter />);
    const version = screen.getByTestId('project-version');
    expect(version).toBeInTheDocument();
  });
});
