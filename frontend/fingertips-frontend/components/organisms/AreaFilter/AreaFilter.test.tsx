import { render, screen, within } from '@testing-library/react';
import { AreaFilter } from '.';
import { AreaType, AreaWithRelations } from '@/generated-sources/ft-api-client';
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
      [SearchParams.AreaTypeSelected]: 'A002',
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

const generateAreaType = (name: string, level: number): AreaType => ({
  name,
  level,
  hierarchyName: `hierarchyName for ${name}`,
});

const availableAreaTypes: AreaType[] = [
  generateAreaType('A003', 3),
  generateAreaType('A001', 1),
  generateAreaType('A002', 2),
  generateAreaType('A000', 0),
];

describe('Area Filter', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('snapshot test', () => {
    const container = render(<AreaFilter availableAreaTypes={[]} />);

    expect(container.asFragment()).toMatchSnapshot();
  });

  it('should render the Filters heading', () => {
    render(<AreaFilter />);

    expect(screen.getByRole('heading')).toHaveTextContent('Filters');
  });

  it('should disable the select area type drop down when there are areas selected', () => {
    render(<AreaFilter selectedAreas={[mockArea]} />);

    expect(
      screen.getByRole('combobox', { name: /Select an area type/i })
    ).toBeDisabled();
  });

  it('should not disable the select area type drop down when there are no areas selected', () => {
    render(<AreaFilter selectedAreas={[]} />);

    expect(
      screen.getByRole('combobox', { name: /Select an area type/i })
    ).not.toBeDisabled();
  });

  it('should render the select area type drop down and indicate there are no areas selected', () => {
    render(<AreaFilter availableAreaTypes={availableAreaTypes} />);

    expect(screen.getByText(/Selected areas \(0\)/i)).toBeInTheDocument();
    expect(
      screen.getByRole('combobox', { name: /Select an area type/i })
    ).toBeInTheDocument();
  });

  it('should render all the available areaTypes sorted by level', () => {
    const expectedAreaTypeOptions = ['A000', 'A001', 'A002', 'A003'];

    render(<AreaFilter availableAreaTypes={availableAreaTypes} />);

    const areaTypeDropDown = screen.getByRole('combobox', {
      name: /Select an area type/i,
    });

    const allOptions = within(areaTypeDropDown).getAllByRole('option');

    expect(
      screen.getByRole('combobox', { name: /Select an area type/i })
    ).toHaveLength(4);

    allOptions.forEach((option, i) => {
      expect(option.textContent).toEqual(expectedAreaTypeOptions[i]);
    });
  });

  it('should have the area type provided via the searchParams selected', () => {
    render(<AreaFilter availableAreaTypes={availableAreaTypes} />);

    expect(
      screen.getByRole('combobox', { name: /Select an area type/i })
    ).toHaveValue('A002');
  });

  it('should add the selected areaType to the url', async () => {
    const user = userEvent.setup();

    render(<AreaFilter availableAreaTypes={availableAreaTypes} />);

    await user.selectOptions(
      screen.getByRole('combobox', { name: /Select an area type/i }),
      'A001'
    );

    expect(mockReplace).toHaveBeenCalledWith(
      `${mockPath}?${SearchParams.AreaTypeSelected}=A001`,
      {
        scroll: false,
      }
    );
  });
});
