import { render, screen } from '@testing-library/react';
import { AreaFilter } from '.';
import { AreaWithRelations } from '@/generated-sources/ft-api-client';
import userEvent from '@testing-library/user-event';
import { SearchParams } from '@/lib/searchStateManager';

const mockPath = 'some-mock-path';
const mockReplace = jest.fn();

jest.mock('next/navigation', () => {
  const originalModule = jest.requireActual('next/navigation');

  return {
    ...originalModule,
    usePathname: () => mockPath,
    useSearchParams: () => ({
      [SearchParams.AreaTypeSelected]: 'area type 002',
    }),
    useRouter: jest.fn().mockImplementation(() => ({
      replace: mockReplace,
    })),
  };
});

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

  it('should render the select area type drop down and indicate there are no areas selected', () => {
    render(<AreaFilter availableAreaTypes={availableAreaTypes} />);

    expect(
      screen.getByText(/There are no areas selected/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('combobox', { name: /Select an area type/i })
    ).toBeInTheDocument();
  });

  it('should render all the available areaTypes', () => {
    render(<AreaFilter availableAreaTypes={availableAreaTypes} />);

    expect(
      screen.getByRole('combobox', { name: /Select an area type/i })
    ).toHaveLength(2);
  });

  it('should have the area type provided via the searchParams selected', () => {
    render(<AreaFilter availableAreaTypes={availableAreaTypes} />);

    expect(
      screen.getByRole('combobox', { name: /Select an area type/i })
    ).toHaveValue('area type 002');
  });

  it('should add the selected areaType to the url', async () => {
    const user = userEvent.setup();

    render(<AreaFilter availableAreaTypes={availableAreaTypes} />);

    await user.selectOptions(
      screen.getByRole('combobox', { name: /Select an area type/i }),
      'area type 001'
    );

    expect(mockReplace).toBeCalledWith(
      `${mockPath}?${SearchParams.AreaTypeSelected}=area+type+001`,
      {
        scroll: false,
      }
    );
  });
});
