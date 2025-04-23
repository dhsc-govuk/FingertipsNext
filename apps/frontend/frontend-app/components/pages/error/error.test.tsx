import { render } from '@testing-library/react';
import { expect } from '@jest/globals';
import { ErrorPage } from '.';
import { SearchStateContext } from '@/context/SearchStateContext';

const mockSearchStateContext: SearchStateContext = {
  getSearchState: jest.fn(),
  setSearchState: jest.fn(),
};
jest.mock('@/context/SearchStateContext', () => {
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
