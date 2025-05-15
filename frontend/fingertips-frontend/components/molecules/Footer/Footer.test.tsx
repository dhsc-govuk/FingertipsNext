import { render, screen } from '@testing-library/react';
import { FTFooter } from '.';
import { expect } from '@jest/globals';

describe('FTFooter', () => {
  it('should match snapshot', () => {
    const container = render(<FTFooter tag={'0.0.0'} hash={'12345678'} />);
    expect(container.asFragment()).toMatchSnapshot();
  });

  it('should render the project version', () => {
    render(<FTFooter tag={'vXYZ'} hash={'ABCD'} />);
    const version = screen.getByTestId('project-version');
    expect(version).toBeInTheDocument();
  });
});
