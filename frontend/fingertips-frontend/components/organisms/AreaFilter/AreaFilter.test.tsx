import { render, screen, within } from '@testing-library/react';
import { AreaFilter } from '.';
import userEvent from '@testing-library/user-event';
import { SearchParams } from '@/lib/searchStateManager';
import {
  mockAreaDataForNHSRegion,
  mockAvailableAreas,
} from '@/mock/data/areaData';
import {
  allAreaTypes,
  englandAreaType,
  nhsIntegratedCareBoardsAreaType,
  nhsRegionsAreaType,
} from '@/lib/areaFilterHelpers/areaType';
import { AreaType } from '@/generated-sources/ft-api-client';
import {
  eastEnglandNHSRegion,
  northEastAndYorkshireNHSRegion,
} from '@/mock/data/areas/nhsRegionsAreas';

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
      `&${SearchParams.AreaTypeSelected}=NHS+Regions`,
    ].join('');

    const user = userEvent.setup();
    render(
      <AreaFilter
        selectedAreasData={mockSelectedAreasData}
        searchState={{
          [SearchParams.AreasSelected]: ['E40000012', 'E40000007'],
          [SearchParams.AreaTypeSelected]: 'NHS Regions',
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
      render(<AreaFilter availableAreaTypes={allAreaTypes} />);

      expect(screen.getByText(/Selected areas \(0\)/i)).toBeInTheDocument();
      expect(
        screen.getByRole('combobox', { name: /Select an area type/i })
      ).toBeInTheDocument();
    });

    it('should render all the available areaTypes sorted by level', () => {
      render(<AreaFilter availableAreaTypes={allAreaTypes} />);

      const areaTypeDropDown = screen.getByRole('combobox', {
        name: /Select an area type/i,
      });

      const allOptions = within(areaTypeDropDown).getAllByRole('option');

      expect(
        screen.getByRole('combobox', { name: /Select an area type/i })
      ).toHaveLength(allAreaTypes.length);

      allOptions.forEach((option, i) => {
        expect(option.textContent).toEqual(allAreaTypes[i].name);
      });
    });

    it('should have have the areaTypeSelected as the pre-selected value', () => {
      render(
        <AreaFilter
          availableAreaTypes={allAreaTypes}
          searchState={{
            [SearchParams.AreaTypeSelected]: 'nhs-regions',
          }}
        />
      );

      expect(
        screen.getByRole('combobox', { name: /Select an area type/i })
      ).toHaveTextContent('NHS Regions');
    });

    it('should add the selected areaType to the url', async () => {
      const expectedPath = [
        `${mockPath}`,
        `?${SearchParams.AreasSelected}=E40000012&${SearchParams.AreasSelected}=E40000007`,
        `&${SearchParams.AreaTypeSelected}=nhs-regions`,
      ].join('');

      const user = userEvent.setup();
      render(
        <AreaFilter
          availableAreaTypes={allAreaTypes}
          searchState={{
            [SearchParams.AreasSelected]: ['E40000012', 'E40000007'],
          }}
        />
      );

      await user.selectOptions(
        screen.getByRole('combobox', { name: /Select an area type/i }),
        'NHS Regions'
      );

      expect(mockReplace).toHaveBeenCalledWith(expectedPath, {
        scroll: false,
      });
    });
  });

  describe('Group type', () => {
    const availableGroupTypes: AreaType[] = [
      englandAreaType,
      nhsRegionsAreaType,
      nhsIntegratedCareBoardsAreaType,
    ];

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

    it('should render all applicable group types provided', () => {
      render(
        <AreaFilter
          availableAreaTypes={allAreaTypes}
          availableGroupTypes={availableGroupTypes}
          searchState={{
            [SearchParams.AreaTypeSelected]: 'nhs-regions',
          }}
        />
      );

      const groupTypeDropDown = screen.getByRole('combobox', {
        name: /1. Select a group type/i,
      });

      const allOptions = within(groupTypeDropDown).getAllByRole('option');

      expect(
        screen.getByRole('combobox', { name: /1. Select a group type/i })
      ).toHaveLength(3);

      allOptions.forEach((option, i) => {
        expect(option.textContent).toEqual(availableGroupTypes[i].name);
      });
    });

    it('should have have the groupTypeSelected as the pre-selected value', () => {
      render(
        <AreaFilter
          availableAreaTypes={allAreaTypes}
          availableGroupTypes={availableGroupTypes}
          searchState={{
            [SearchParams.AreaTypeSelected]: 'nhs-regions',
            [SearchParams.GroupTypeSelected]: 'england',
          }}
        />
      );

      expect(
        screen.getByRole('combobox', { name: /Select a group type/i })
      ).toHaveTextContent('England');
    });

    it('should add the selected groupType to the url', async () => {
      const expectedPath = [
        `${mockPath}`,
        `?${SearchParams.AreasSelected}=E40000012&${SearchParams.AreasSelected}=E40000007`,
        `&${SearchParams.AreaTypeSelected}=nhs-regions`,
        `&${SearchParams.GroupTypeSelected}=england`,
      ].join('');

      const user = userEvent.setup();

      render(
        <AreaFilter
          availableAreaTypes={allAreaTypes}
          availableGroupTypes={availableGroupTypes}
          searchState={{
            [SearchParams.AreasSelected]: ['E40000012', 'E40000007'],
            [SearchParams.AreaTypeSelected]: 'nhs-regions',
          }}
        />
      );

      await user.selectOptions(
        screen.getByRole('combobox', { name: /Select a group type/i }),
        'England'
      );

      expect(mockReplace).toHaveBeenCalledWith(expectedPath, {
        scroll: false,
      });
    });
  });

  describe('Areas', () => {
    it('should show all the applicable areas as checkboxes', () => {
      const availableAreas = mockAvailableAreas['nhs-regions'];

      render(
        <AreaFilter
          availableAreaTypes={allAreaTypes}
          availableAreas={availableAreas}
          searchState={{
            [SearchParams.AreaTypeSelected]: 'nhs-regions',
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

    it('should have the checkboxes of selectedArea pre-selected', () => {
      const availableAreas = mockAvailableAreas['nhs-regions'];

      render(
        <AreaFilter
          availableAreaTypes={allAreaTypes}
          availableAreas={availableAreas}
          searchState={{
            [SearchParams.AreaTypeSelected]: 'nhs-regions',
            [SearchParams.AreasSelected]: ['E40000007', 'E40000012'],
          }}
          selectedAreasData={[
            eastEnglandNHSRegion,
            northEastAndYorkshireNHSRegion,
          ]}
        />
      );

      availableAreas.forEach((area) => {
        if (area.code === 'E40000007' || area.code === 'E40000012') {
          expect(
            screen.getByRole('checkbox', { name: area.name })
          ).toBeChecked();
        } else {
          expect(
            screen.getByRole('checkbox', { name: area.name })
          ).not.toBeChecked();
        }
      });
    });

    it('should update the url when an area is selected', async () => {
      const expectedPath = [
        `${mockPath}`,
        `?${SearchParams.AreasSelected}=${eastEnglandNHSRegion.code}`,
        `&${SearchParams.AreaTypeSelected}=nhs-regions`,
      ].join('');
      const availableAreas = mockAvailableAreas['nhs-regions'];

      render(
        <AreaFilter
          availableAreaTypes={allAreaTypes}
          availableAreas={availableAreas}
          searchState={{
            [SearchParams.AreaTypeSelected]: 'nhs-regions',
          }}
        />
      );

      const user = userEvent.setup();
      await user.click(
        screen.getByRole('checkbox', { name: eastEnglandNHSRegion.name })
      );

      expect(mockReplace).toHaveBeenCalledWith(expectedPath, {
        scroll: false,
      });
    });

    it('should update the url when an area is de-selected', async () => {
      const expectedPath = [
        `${mockPath}`,
        `?${SearchParams.AreaTypeSelected}=nhs-regions`,
      ].join('');
      const availableAreas = mockAvailableAreas['nhs-regions'];

      render(
        <AreaFilter
          availableAreaTypes={allAreaTypes}
          availableAreas={availableAreas}
          searchState={{
            [SearchParams.AreaTypeSelected]: 'nhs-regions',
            [SearchParams.AreasSelected]: ['E40000007'],
          }}
          selectedAreasData={[eastEnglandNHSRegion]}
        />
      );

      const user = userEvent.setup();
      await user.click(
        screen.getByRole('checkbox', { name: eastEnglandNHSRegion.name })
      );

      expect(mockReplace).toHaveBeenCalledWith(expectedPath, {
        scroll: false,
      });
    });
  });
});
