import { render } from '@testing-library/react';
import { FTFooter } from '.';

describe('FTFooter', () => {
  it('should match snapshot', () => {
    const container = render(<FTFooter />);

    expect(container.asFragment()).toMatchSnapshot();
  });
});
