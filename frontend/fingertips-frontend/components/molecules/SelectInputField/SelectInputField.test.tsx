import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AreaSelectInputField } from './index';
import { AreaDocument } from '@/lib/search/searchTypes';

const mockAreas: Omit<AreaDocument, 'areaType'>[] = [
  { areaCode: '001', areaName: 'Area One' },
  { areaCode: '002', areaName: 'Area Two' },
];

describe('AreaSelectInputField', () => {
  test('renders correctly and matches snapshot', () => {
    const { container } = render(
      <AreaSelectInputField areas={mockAreas} title="Select an Area" />
    );
    expect(container).toMatchSnapshot();
  });

  test('renders select options correctly', () => {
    render(<AreaSelectInputField areas={mockAreas} title="Select an Area" />);
    expect(screen.getByText('Area One')).toBeInTheDocument();
    expect(screen.getByText('Area Two')).toBeInTheDocument();
  });

  test('does not render when visibility is false', () => {
    const { container } = render(
      <AreaSelectInputField
        areas={mockAreas}
        title="Select an Area"
        visibility={false}
      />
    );
    expect(container.firstChild).toBeNull();
  });
});
