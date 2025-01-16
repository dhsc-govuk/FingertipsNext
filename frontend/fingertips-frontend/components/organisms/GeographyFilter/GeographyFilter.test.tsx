import { render, screen } from '@testing-library/react';
import { GeographyFilter } from '.';

describe('Geography Filter', () => {
  it('snapshot test', () => {
    const container = render(<GeographyFilter availableAreaTypes={[]} />);

    expect(container.asFragment()).toMatchSnapshot();
  });

  it('should render the Filters heading', () => {
    render(<GeographyFilter availableAreaTypes={[]} />);

    expect(screen.getByRole('heading')).toHaveTextContent('Filters');
  });

  it('should render the selected areas and not the area type drop down when there are areas selected', () => {
    render(
      <GeographyFilter
        selectedAreas={[{ id: '001', name: 'selected area 001' }]}
        availableAreaTypes={[]}
      />
    );

    expect(screen.getByText(/Areas Selected/i)).toBeInTheDocument();
    expect(
      screen.queryByRole('combobox', { name: /Select an area type/i })
    ).not.toBeInTheDocument();
  });

  it('should render the select area type drop down if there are no selected areas', () => {
    render(<GeographyFilter availableAreaTypes={[]} />);

    expect(screen.queryByText(/Areas Selected/i)).not.toBeInTheDocument();
    expect(
      screen.getByRole('combobox', { name: /Select an area type/i })
    ).toBeInTheDocument();
  });
});
