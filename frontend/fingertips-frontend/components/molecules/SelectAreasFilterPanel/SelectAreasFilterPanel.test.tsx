import { render, screen, within } from '@testing-library/react';
import { SelectAreasFilterPanel } from '.';
import { mockAvailableAreas } from '@/mock/data/areaData';
import {
  allAreaTypes,
  englandAreaType,
  nhsIntegratedCareBoardsAreaType,
  nhsRegionsAreaType,
} from '@/lib/areaFilterHelpers/areaType';
import { SearchParams } from '@/lib/searchStateManager';
import userEvent from '@testing-library/user-event';
import { Area, AreaType } from '@/generated-sources/ft-api-client';
import {
  allNhsRegions,
  eastEnglandNHSRegion,
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

const mockSearchStateWithSelectedAreas = {
  [SearchParams.AreasSelected]: ['E40000007', 'E40000012'],
};

const mockSearchStateWithNoSelectedAreas = {
  [SearchParams.AreasSelected]: [],
};

describe('SelectAreasFilterPanel', () => {
  describe('Area type', () => {
    const areaTypeDropDownLabel = 'Select an area type';

    it('should disable the select area type drop down when there are areas selected', () => {
      render(
        <SelectAreasFilterPanel
          searchState={mockSearchStateWithSelectedAreas}
        />
      );

      expect(
        screen.getByRole('combobox', { name: areaTypeDropDownLabel })
      ).toBeDisabled();
    });

    it('should not disable the select area type drop down when there are no areas selected', () => {
      render(
        <SelectAreasFilterPanel
          searchState={mockSearchStateWithNoSelectedAreas}
        />
      );

      expect(
        screen.getByRole('combobox', { name: areaTypeDropDownLabel })
      ).not.toBeDisabled();
    });

    it('should render the select area type drop down when there are no areas selected', () => {
      render(
        <SelectAreasFilterPanel
          areaFilterData={{
            availableAreaTypes: allAreaTypes,
          }}
        />
      );

      expect(
        screen.getByRole('combobox', { name: areaTypeDropDownLabel })
      ).toBeInTheDocument();
    });

    it('should render all the available areaTypes sorted by level', () => {
      render(
        <SelectAreasFilterPanel
          areaFilterData={{ availableAreaTypes: allAreaTypes }}
        />
      );

      const areaTypeDropDown = screen.getByRole('combobox', {
        name: areaTypeDropDownLabel,
      });

      const allOptions = within(areaTypeDropDown).getAllByRole('option');

      expect(
        screen.getByRole('combobox', { name: areaTypeDropDownLabel })
      ).toHaveLength(allAreaTypes.length);

      allOptions.forEach((option, i) => {
        expect(option.textContent).toEqual(allAreaTypes[i].name);
      });
    });

    it('should have have the areaTypeSelected as the pre-selected value', () => {
      render(
        <SelectAreasFilterPanel
          areaFilterData={{ availableAreaTypes: allAreaTypes }}
          searchState={{
            [SearchParams.AreaTypeSelected]: 'nhs-regions',
          }}
        />
      );

      expect(
        screen.getByRole('combobox', { name: areaTypeDropDownLabel })
      ).toHaveTextContent('NHS Regions');
    });

    it('should add the selected areaType to the url', async () => {
      const expectedPath = [
        `${mockPath}`,
        `?${SearchParams.AreaTypeSelected}=nhs-regions`,
      ].join('');

      const user = userEvent.setup();
      render(
        <SelectAreasFilterPanel
          areaFilterData={{ availableAreaTypes: allAreaTypes }}
        />
      );

      await user.selectOptions(
        screen.getByRole('combobox', { name: areaTypeDropDownLabel }),
        'NHS Regions'
      );

      expect(mockReplace).toHaveBeenCalledWith(expectedPath, {
        scroll: false,
      });
    });

    it('should remove any previous state from the url for groupType and group selected when areaType is changed', async () => {
      const expectedPath = [
        `${mockPath}`,
        `?${SearchParams.AreaTypeSelected}=nhs-regions`,
      ].join('');

      const user = userEvent.setup();
      render(
        <SelectAreasFilterPanel
          areaFilterData={{ availableAreaTypes: allAreaTypes }}
          searchState={{
            [SearchParams.GroupTypeSelected]: 'england',
            [SearchParams.GroupSelected]: 'england',
          }}
        />
      );

      await user.selectOptions(
        screen.getByRole('combobox', { name: areaTypeDropDownLabel }),
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

    const groupTypeDropDownLabel = 'Select a group type';

    it('should disable the select group type drop down when there are areas selected', () => {
      render(
        <SelectAreasFilterPanel
          searchState={mockSearchStateWithSelectedAreas}
        />
      );

      expect(
        screen.getByRole('combobox', { name: groupTypeDropDownLabel })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('combobox', { name: groupTypeDropDownLabel })
      ).toBeDisabled();
    });

    it('should not disable the select group type drop down when there are no areas selected', () => {
      render(
        <SelectAreasFilterPanel
          searchState={mockSearchStateWithNoSelectedAreas}
        />
      );

      expect(
        screen.getByRole('combobox', { name: groupTypeDropDownLabel })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('combobox', { name: groupTypeDropDownLabel })
      ).not.toBeDisabled();
    });

    it('should render all applicable group types provided', () => {
      render(
        <SelectAreasFilterPanel
          areaFilterData={{
            availableAreaTypes: allAreaTypes,
            availableGroupTypes: availableGroupTypes,
          }}
          searchState={{
            [SearchParams.AreaTypeSelected]: 'nhs-regions',
          }}
        />
      );

      const groupTypeDropDown = screen.getByRole('combobox', {
        name: groupTypeDropDownLabel,
      });

      const allOptions = within(groupTypeDropDown).getAllByRole('option');

      expect(
        screen.getByRole('combobox', { name: groupTypeDropDownLabel })
      ).toHaveLength(3);

      allOptions.forEach((option, i) => {
        expect(option.textContent).toEqual(availableGroupTypes[i].name);
      });
    });

    it('should have have the groupTypeSelected as the pre-selected value', () => {
      render(
        <SelectAreasFilterPanel
          areaFilterData={{
            availableAreaTypes: allAreaTypes,
            availableGroupTypes: availableGroupTypes,
          }}
          searchState={{
            [SearchParams.AreaTypeSelected]: 'nhs-regions',
            [SearchParams.GroupTypeSelected]: 'england',
          }}
        />
      );

      expect(
        screen.getByRole('combobox', { name: groupTypeDropDownLabel })
      ).toHaveTextContent('England');
    });

    it('should add the selected groupType to the url', async () => {
      const expectedPath = [
        `${mockPath}`,
        `?${SearchParams.AreaTypeSelected}=nhs-regions`,
        `&${SearchParams.GroupTypeSelected}=england`,
      ].join('');

      const user = userEvent.setup();

      render(
        <SelectAreasFilterPanel
          areaFilterData={{
            availableAreaTypes: allAreaTypes,
            availableGroupTypes: availableGroupTypes,
          }}
          searchState={{
            [SearchParams.AreaTypeSelected]: 'nhs-regions',
          }}
        />
      );

      await user.selectOptions(
        screen.getByRole('combobox', { name: groupTypeDropDownLabel }),
        'England'
      );

      expect(mockReplace).toHaveBeenCalledWith(expectedPath, {
        scroll: false,
      });
    });

    it('should remove any previous state from the url for group selected when groupType is changed', async () => {
      const expectedPath = [
        `${mockPath}`,
        `?${SearchParams.AreaTypeSelected}=nhs-regions`,
        `&${SearchParams.GroupTypeSelected}=england`,
      ].join('');

      const user = userEvent.setup();

      render(
        <SelectAreasFilterPanel
          areaFilterData={{
            availableAreaTypes: allAreaTypes,
            availableGroupTypes: availableGroupTypes,
          }}
          searchState={{
            [SearchParams.AreaTypeSelected]: 'nhs-regions',
            [SearchParams.GroupSelected]: 'england',
          }}
        />
      );

      await user.selectOptions(
        screen.getByRole('combobox', { name: groupTypeDropDownLabel }),
        'England'
      );

      expect(mockReplace).toHaveBeenCalledWith(expectedPath, {
        scroll: false,
      });
    });
  });

  describe('Group', () => {
    const availableGroups: Area[] = allNhsRegions;

    const groupDropDownLabel = 'Select a group';

    it('should disable the select group type drop down when there are areas selected', () => {
      render(
        <SelectAreasFilterPanel
          searchState={mockSearchStateWithSelectedAreas}
        />
      );

      expect(
        screen.getByRole('combobox', { name: groupDropDownLabel })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('combobox', { name: groupDropDownLabel })
      ).toBeDisabled();
    });

    it('should not disable the select group type drop down when there are no areas selected', () => {
      render(
        <SelectAreasFilterPanel
          searchState={mockSearchStateWithNoSelectedAreas}
        />
      );

      expect(
        screen.getByRole('combobox', { name: groupDropDownLabel })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('combobox', { name: groupDropDownLabel })
      ).not.toBeDisabled();
    });

    it('should render all applicable groups provided', () => {
      render(
        <SelectAreasFilterPanel
          areaFilterData={{
            availableAreaTypes: allAreaTypes,
            availableGroups: availableGroups,
          }}
          searchState={{
            [SearchParams.AreaTypeSelected]: 'nhs-regions',
          }}
        />
      );

      const groupDropDown = screen.getByRole('combobox', {
        name: groupDropDownLabel,
      });

      const allOptions = within(groupDropDown).getAllByRole('option');

      expect(
        screen.getByRole('combobox', { name: groupDropDownLabel })
      ).toHaveLength(7);

      allOptions.forEach((option, i) => {
        expect(option.textContent).toEqual(availableGroups[i].name);
      });
    });

    it('should have have the group selected as the pre-selected value', () => {
      render(
        <SelectAreasFilterPanel
          areaFilterData={{
            availableAreaTypes: allAreaTypes,
            availableGroups: availableGroups,
          }}
          searchState={{
            [SearchParams.AreaTypeSelected]: 'nhs-regions',
            [SearchParams.GroupTypeSelected]: 'england',
            [SearchParams.GroupSelected]: availableGroups[0].name,
          }}
        />
      );

      expect(
        screen.getByRole('combobox', { name: groupDropDownLabel })
      ).toHaveTextContent(availableGroups[0].name);
    });

    it('should add the selected group to the url', async () => {
      const expectedPath = [
        `${mockPath}`,
        `?${SearchParams.AreaTypeSelected}=nhs-regions`,
        `&${SearchParams.GroupSelected}=${availableGroups[1].code}`,
      ].join('');

      const user = userEvent.setup();

      render(
        <SelectAreasFilterPanel
          areaFilterData={{
            availableAreaTypes: allAreaTypes,
            availableGroups: availableGroups,
          }}
          searchState={{
            [SearchParams.AreaTypeSelected]: 'nhs-regions',
          }}
        />
      );

      await user.selectOptions(
        screen.getByRole('combobox', { name: groupDropDownLabel }),
        availableGroups[1].name
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
        <SelectAreasFilterPanel
          areaFilterData={{
            availableAreaTypes: allAreaTypes,
            availableAreas: availableAreas,
          }}
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

    it('should have the checkboxes of the selected areas pre-selected', () => {
      const availableAreas = mockAvailableAreas['nhs-regions'];

      render(
        <SelectAreasFilterPanel
          areaFilterData={{
            availableAreaTypes: allAreaTypes,
            availableAreas: availableAreas,
          }}
          searchState={{
            [SearchParams.AreaTypeSelected]: 'nhs-regions',
            [SearchParams.AreasSelected]: ['E40000007', 'E40000012'],
          }}
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
        <SelectAreasFilterPanel
          areaFilterData={{
            availableAreaTypes: allAreaTypes,
            availableAreas: availableAreas,
          }}
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
        <SelectAreasFilterPanel
          areaFilterData={{
            availableAreaTypes: allAreaTypes,
            availableAreas: availableAreas,
          }}
          searchState={{
            [SearchParams.AreaTypeSelected]: 'nhs-regions',
            [SearchParams.AreasSelected]: ['E40000007'],
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
  });
});
