import { render, screen, within } from '@testing-library/react';
import { AreaFilter } from '.';
import userEvent from '@testing-library/user-event';
import { SearchParams } from '@/lib/searchStateManager';
import {
  mockAreaDataForNHSRegion,
  mockAreaTypes,
  mockAvailableAreas,
} from '@/mock/data/areaData';

const mockPath = 'some-mock-path';
const mockReplace = jest.fn();

jest.mock('next/navigation', () => {
  const originalModule = jest.requireActual('next/navigation');

  return {
    ...originalModule,
    usePathname: () => mockPath,
    useSearchParams: () => {},
    useRouter: jest.fn().mockImplementation(() => ({
      replace: mockReplace,
    })),
  };
});

const mockSelectedAreasData = [
  mockAreaDataForNHSRegion['E40000007'],
  mockAreaDataForNHSRegion['E40000012'],
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
    render(<AreaFilter selectedAreasData={mockSelectedAreasData} />);

    expect(screen.getByText(/Selected areas \(2\)/i)).toBeInTheDocument();
    expect(screen.getAllByTestId('pill-container')).toHaveLength(2);
  });

  it('should remove the area selected from the url when the remove icon is clicked for the area selected', async () => {
    const expectedPath = [
      `${mockPath}`,
      `?${SearchParams.AreasSelected}=E40000012`,
      `&${SearchParams.AreaTypeSelected}=NHS+region`,
    ].join('');

    const user = userEvent.setup();
    render(
      <AreaFilter
        selectedAreasData={mockSelectedAreasData}
        searchState={{
          [SearchParams.AreasSelected]: ['E40000012', 'E40000007'],
          [SearchParams.AreaTypeSelected]: 'NHS region',
        }}
      />
    );

    const firstSelectedAreaPill = screen.getAllByTestId('pill-container')[0];
    await user.click(
      within(firstSelectedAreaPill).getByTestId('remove-icon-div')
    );

    expect(mockReplace).toHaveBeenCalledWith(expectedPath, {
      scroll: false,
    });
  });

  describe('Area type', () => {
    it('should disable the select area type drop down when there are areas selected', () => {
      render(<AreaFilter selectedAreasData={mockSelectedAreasData} />);

      expect(
        screen.getByRole('combobox', { name: /Select an area type/i })
      ).toBeDisabled();
    });

    it('should not disable the select area type drop down when there are no areas selected', () => {
      render(<AreaFilter selectedAreasData={[]} />);

      expect(
        screen.getByRole('combobox', { name: /Select an area type/i })
      ).not.toBeDisabled();
    });

    it('should render the select area type drop down and indicate there are no areas selected', () => {
      render(<AreaFilter availableAreaTypes={mockAreaTypes} />);

      expect(screen.getByText(/Selected areas \(0\)/i)).toBeInTheDocument();
      expect(
        screen.getByRole('combobox', { name: /Select an area type/i })
      ).toBeInTheDocument();
    });

    it('should render all the available areaTypes sorted by level', () => {
      render(<AreaFilter availableAreaTypes={mockAreaTypes} />);

      const areaTypeDropDown = screen.getByRole('combobox', {
        name: /Select an area type/i,
      });

      const allOptions = within(areaTypeDropDown).getAllByRole('option');

      expect(
        screen.getByRole('combobox', { name: /Select an area type/i })
      ).toHaveLength(mockAreaTypes.length);

      allOptions.forEach((option, i) => {
        expect(option.textContent).toEqual(mockAreaTypes[i].name);
      });
    });

    it('should have have the areaTypeSelected as the pre-selected value', () => {
      render(
        <AreaFilter
          availableAreaTypes={mockAreaTypes}
          searchState={{
            [SearchParams.AreaTypeSelected]: 'NHS region',
          }}
        />
      );

      expect(
        screen.getByRole('combobox', { name: /Select an area type/i })
      ).toHaveValue('NHS region');
    });

    it('should add the selected areaType to the url', async () => {
      const expectedPath = [
        `${mockPath}`,
        `?${SearchParams.AreasSelected}=E40000012&${SearchParams.AreasSelected}=E40000007`,
        `&${SearchParams.AreaTypeSelected}=NHS+region`,
      ].join('');

      const user = userEvent.setup();
      render(
        <AreaFilter
          availableAreaTypes={mockAreaTypes}
          searchState={{
            [SearchParams.AreasSelected]: ['E40000012', 'E40000007'],
          }}
        />
      );

      await user.selectOptions(
        screen.getByRole('combobox', { name: /Select an area type/i }),
        'NHS region'
      );

      expect(mockReplace).toHaveBeenCalledWith(expectedPath, {
        scroll: false,
      });
    });
  });

  describe('Group type', () => {
    it('should disable the select group type drop down when there are areas selected', () => {
      render(<AreaFilter selectedAreasData={mockSelectedAreasData} />);

      expect(
        screen.getByRole('combobox', { name: /1. Select a group type/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('combobox', { name: /1. Select a group type/i })
      ).toBeDisabled();
    });

    it('should not disable the select group type drop down when there are no areas selected', () => {
      render(<AreaFilter selectedAreasData={[]} />);

      expect(
        screen.getByRole('combobox', { name: /1. Select a group type/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('combobox', { name: /1. Select a group type/i })
      ).not.toBeDisabled();
    });

    it('should render all applicable group types based upon the area type selected', () => {
      const expectedAreaTypeOptions = ['Country'];

      render(
        <AreaFilter
          availableAreaTypes={mockAreaTypes}
          searchState={{
            [SearchParams.AreaTypeSelected]: 'NHS region',
          }}
        />
      );

      const groupTypeDropDown = screen.getByRole('combobox', {
        name: /1. Select a group type/i,
      });

      const allOptions = within(groupTypeDropDown).getAllByRole('option');

      expect(
        screen.getByRole('combobox', { name: /1. Select a group type/i })
      ).toHaveLength(1);

      allOptions.forEach((option, i) => {
        expect(option.textContent).toEqual(expectedAreaTypeOptions[i]);
      });
    });

    it('should have have the groupTypeSelected as the pre-selected value', () => {
      render(
        <AreaFilter
          availableAreaTypes={mockAreaTypes}
          searchState={{
            [SearchParams.AreaTypeSelected]: 'NHS region',
            [SearchParams.GroupTypeSelected]: 'Country',
          }}
        />
      );

      expect(
        screen.getByRole('combobox', { name: /Select a group type/i })
      ).toHaveValue('Country');
    });

    it('should add the selected groupType to the url', async () => {
      const expectedPath = [
        `${mockPath}`,
        `?${SearchParams.AreasSelected}=E40000012&${SearchParams.AreasSelected}=E40000007`,
        `&${SearchParams.AreaTypeSelected}=NHS+region`,
        `&${SearchParams.GroupTypeSelected}=Country`,
      ].join('');

      const user = userEvent.setup();

      render(
        <AreaFilter
          availableAreaTypes={mockAreaTypes}
          searchState={{
            [SearchParams.AreasSelected]: ['E40000012', 'E40000007'],
            [SearchParams.AreaTypeSelected]: 'NHS region',
          }}
        />
      );

      await user.selectOptions(
        screen.getByRole('combobox', { name: /Select a group type/i }),
        'Country'
      );

      expect(mockReplace).toHaveBeenCalledWith(expectedPath, {
        scroll: false,
      });
    });
  });

  describe('Areas', () => {
    it('should show all the applicable areas as checkboxes', () => {
      const availableAreas = mockAvailableAreas['NHS region'];

      render(
        <AreaFilter
          availableAreaTypes={mockAreaTypes}
          availableAreas={availableAreas}
          searchState={{
            [SearchParams.AreaTypeSelected]: 'NHS region',
          }}
        />
      );

      expect(screen.getAllByRole('checkbox')).toHaveLength(7);

      availableAreas.forEach((area) => {
        expect(
          screen.getByRole('checkbox', { name: area.name })
        ).toBeInTheDocument();
      });
    });
  });
});
