import React from 'react';
import { render, screen } from '@testing-library/react';
import AreaAutoCompleteInputField from './index';
import { AreaDocument } from '@/lib/search/searchTypes';

jest.mock('@/components/forms/SearchForm/searchActions', () => ({
  getSearchSuggestions: jest.fn(),
}));

describe('AreaAutoCompleteInputField', () => {
  const mockOnAreaSelected = jest.fn();
  const mockAreas: AreaDocument[] = [
    { areaCode: '001', areaName: 'London', areaType: 'GPs' },
    { areaCode: '002', areaName: 'Manchester', areaType: 'GPs' },
  ];
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('take a component snapshot', async () => {
    const { asFragment } = render(
      <AreaAutoCompleteInputField
        onAreaSelected={mockOnAreaSelected}
        inputFieldErrorStatus={false}
        defaultSelectedAreas={[
          { areaCode: 'GPs', areaType: 'Type', areaName: 'Some area name' },
        ]}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correctly with default selected areas', () => {
    mockOnAreaSelected.mockClear();
    render(
      <AreaAutoCompleteInputField
        onAreaSelected={mockOnAreaSelected}
        defaultSelectedAreas={mockAreas}
        inputFieldErrorStatus={false}
      />
    );
    expect(screen.getByText('London')).toBeInTheDocument();
    expect(screen.getByText('Manchester')).toBeInTheDocument();
  });
});
