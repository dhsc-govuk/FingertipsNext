import React from 'react';
import { render, } from '@testing-library/react';
import { AreaSearchInputField } from './index'; // Adjust the import path if needed


describe('Testing the AreaSearchInputField', () => {
  it('renders the input field with correct placeholder and hint text', () => {
    const {getByText} = render(<AreaSearchInputField />);
    expect(getByText('Search for an area')).toBeInTheDocument();
    expect(getByText('For example district, county, region, NHS organisation or GP practice or code')).toBeInTheDocument();
  });

  it('renders the styled components correctly', () => {
    const { container } = render(<AreaSearchInputField />);
    const styleAreaSearchBoxPanel = container.querySelector('div');
    const styleSearchHeader = container.querySelector('label');
    expect(styleAreaSearchBoxPanel).toHaveStyle('margin-bottom: 5px');
    expect(styleSearchHeader).toHaveStyle('color: #0b0c0c');
  });

  it("take a snapshot of the UI", ()=>{
    const { asFragment} = render(<AreaSearchInputField />);
    expect(asFragment()).toMatchSnapshot();
  })
});
