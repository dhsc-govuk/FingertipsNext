import { render } from '@testing-library/react';

import { ErrorPage } from '.';
import { SearchStateContext } from '@/context/SearchStateContext';

const mockSearchStateContext: SearchStateContext = {
  getSearchState: vi.fn(),
  setSearchState: vi.fn(),
};
vi.mock('@/context/SearchStateContext', () => {
  return {
    useSearchState: () => mockSearchStateContext,
  };
});

describe('Error Page', () => {
  it('snapshot test', () => {
    const container = render(<ErrorPage />);

    expect(container.asFragment()).toMatchSnapshot();
  });
});
