import { render, screen } from '@testing-library/react';
import { AreaFilter } from '.';
import { AreaWithRelations } from '@/generated-sources/ft-api-client';

const mockArea: AreaWithRelations = {
  code: '001',
  name: 'selected area 001',
  hierarchyName: 'some hierarchy name',
  areaType: 'Integrated Care Board sub-locations',
};

const availableAreaTypes = ['area type 001', 'area type 002'];

describe('Area Filter', () => {
  it('snapshot test', () => {
    const container = render(<AreaFilter availableAreaTypes={[]} />);

    expect(container.asFragment()).toMatchSnapshot();
  });

  it('should render the Filters heading', () => {
    render(<AreaFilter />);

    expect(screen.getByRole('heading')).toHaveTextContent('Filters');
  });

  it('should render the selected areas and not the area type drop down when there are areas selected', () => {
    render(<AreaFilter selectedAreas={[mockArea]} />);

    expect(screen.getByText(/Areas Selected/i)).toBeInTheDocument();
    expect(
      screen.queryByRole('combobox', { name: /Select an area type/i })
    ).not.toBeInTheDocument();
  });

  it('should render the select area type drop down if there are no selected areas', () => {
    render(<AreaFilter availableAreaTypes={availableAreaTypes} />);

    expect(screen.queryByText(/Areas Selected/i)).not.toBeInTheDocument();
    expect(
      screen.getByRole('combobox', { name: /Select an area type/i })
    ).toBeInTheDocument();
  });

  it('should render all the available areaTypes', () => {
    render(<AreaFilter availableAreaTypes={availableAreaTypes} />);

    expect(screen.queryByText(/Areas Selected/i)).not.toBeInTheDocument();
    expect(
      screen.getByRole('combobox', { name: /Select an area type/i })
    ).toHaveLength(2);
  });
});
