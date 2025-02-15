import React from 'react';
import { render } from '@testing-library/react';
import AreaAutoCompleteSearchPanel from './index';

jest.mock('@/components/forms/SearchForm/searchActions', () => ({
  getSearchSuggestions: jest.fn(),
}));

describe('test AreaAutoCompleteSearchPanel', () => {
  const mockOnAreaSelected = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('take a component snapshot', async () => {
    const { asFragment } = render(
      <AreaAutoCompleteSearchPanel
        onAreaSelected={mockOnAreaSelected}
        inputFieldErrorStatus={false}
        defaultValue="Willington Medical Group"
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
