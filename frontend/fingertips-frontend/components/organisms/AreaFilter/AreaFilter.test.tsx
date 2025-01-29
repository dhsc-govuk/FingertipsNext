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
    useSearchParams: () => [
      [[SearchParams.AreaTypeSelected], 'A002'],
      [[SearchParams.AreasSelected], '001'],
      [[SearchParams.AreasSelected], '002'],
    ],
    useRouter: jest.fn().mockImplementation(() => ({
      replace: mockReplace,
    })),
  };
});

const mockSelectedAreasData: AreaWithRelations[] = [
  {
    code: '001',
    name: 'selected area 001',
    hierarchyName: 'some hierarchy name',
    areaType: 'Integrated Care Board sub-locations',
  },
  {
    code: '002',
    name: 'selected area 002',
    hierarchyName: 'some hierarchy name',
    areaType: 'Integrated Care Board sub-locations',
  },
];

const generateAreaType = (name: string, level: number): AreaType => ({
  name,
  level,
  hierarchyName: `hierarchyName for ${name}`,
});

const availableAreaTypes: AreaType[] = [
  generateAreaType('A001', 1),
  generateAreaType('A002', 2),
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

  it('should render the selected areas when there are areas selected', () => {
    render(<AreaFilter selectedAreas={mockSelectedAreasData} />);

    expect(screen.getByText(/Selected areas \(2\)/i)).toBeInTheDocument();
    expect(screen.getAllByTestId('pill-container')).toHaveLength(2);
  });

  it('should disable the select area type drop down when there are areas selected', () => {
    render(<AreaFilter selectedAreas={mockSelectedAreasData} />);

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

  it('should remove the area selected from the url when the remove icon is clicked for the area selected', async () => {
    const expectedPath = [
      `${mockPath}`,
      `?${SearchParams.AreasSelected}=002`,
      `&${SearchParams.AreaTypeSelected}=A002`,
    ].join('');

    const user = userEvent.setup();
    render(<AreaFilter selectedAreas={mockSelectedAreasData} />);

    const firstSelectedAreaPill = screen.getAllByTestId('pill-container')[0];
    await user.click(
      within(firstSelectedAreaPill).getByTestId('remove-icon-div')
    );

    expect(mockReplace).toHaveBeenCalledWith(expectedPath, {
      scroll: false,
    });
  });

  it('should render the select area type drop down and indicate there are no areas selected', () => {
    render(<AreaFilter availableAreaTypes={availableAreaTypes} />);

    expect(screen.getByText(/Selected areas \(0\)/i)).toBeInTheDocument();
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
    ).toHaveValue('A002');
  });

  it('should add the selected areaType to the url', async () => {
    const expectedPath = [
      `${mockPath}`,
      `?${SearchParams.AreasSelected}=001&${SearchParams.AreasSelected}=002`,
      `&${SearchParams.AreaTypeSelected}=A001`,
    ].join('');

    const user = userEvent.setup();
    render(<AreaFilter availableAreaTypes={availableAreaTypes} />);

    await user.selectOptions(
      screen.getByRole('combobox', { name: /Select an area type/i }),
      'A001'
    );

    expect(mockReplace).toHaveBeenCalledWith(expectedPath, {
      scroll: false,
    });
  });
});
