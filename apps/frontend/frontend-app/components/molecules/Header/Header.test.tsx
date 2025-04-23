import { render } from '@testing-library/react';
import { FTHeader } from '.';

describe('Header', () => {
  it('should match snapshot', () => {
    const container = render(<FTHeader />);

    expect(container.asFragment()).toMatchSnapshot();
  });
});
