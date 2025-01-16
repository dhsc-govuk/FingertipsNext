import { render, screen } from '@testing-library/react';
import { GeographyFilter } from '.';

const availableAreaTypes = [
  {
    id: '001',
    name: 'area type 001',
  },
  {
    id: '002',
    name: 'area type 002',
  },
];

describe('Geography Filter', () => {
  it('snapshot test', () => {
    const container = render(<GeographyFilter availableAreaTypes={[]} />);

    expect(container.asFragment()).toMatchSnapshot();
  });

  it('should render the Filters heading', () => {
    render(<GeographyFilter />);

    expect(screen.getByRole('heading')).toHaveTextContent('Filters');
  });

  it('should render the selected areas and not the area type drop down when there are areas selected', () => {
    render(
      <GeographyFilter
        selectedAreas={[{ id: '001', name: 'selected area 001' }]}
      />
    );

    expect(screen.getByText(/Areas Selected/i)).toBeInTheDocument();
    expect(
      screen.queryByRole('combobox', { name: /Select an area type/i })
    ).not.toBeInTheDocument();
  });

  it('should render the select area type drop down if there are no selected areas', () => {
    render(<GeographyFilter availableAreaTypes={availableAreaTypes} />);

    expect(screen.queryByText(/Areas Selected/i)).not.toBeInTheDocument();
    expect(
      screen.getByRole('combobox', { name: /Select an area type/i })
    ).toBeInTheDocument();
  });

  it('should render all the available areaTypes', () => {
    render(<GeographyFilter availableAreaTypes={availableAreaTypes} />);

    expect(screen.queryByText(/Areas Selected/i)).not.toBeInTheDocument();
    expect(
      screen.getByRole('combobox', { name: /Select an area type/i })
    ).toHaveLength(2);
  });
});
