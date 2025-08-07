import { render, screen, within } from '@testing-library/react';
import {
  selectAreaGroupId,
  selectAreaGroupTypeId,
  SelectAreasFilterPanel,
  selectAreaTypeId,
} from '.';
import { mockAvailableAreas } from '@/mock/data/areaData';
import {
  allAreaTypes,
  englandAreaType,
  nhsIntegratedCareBoardsAreaType,
  nhsRegionsAreaType,
  regionsAreaType,
} from '@/lib/areaFilterHelpers/areaType';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import userEvent from '@testing-library/user-event';
import { Area, AreaType } from '@/generated-sources/ft-api-client';
import {
  allNhsRegions,
  eastEnglandNHSRegion,
  northWestNHSRegion,
} from '@/mock/data/areas/nhsRegionsAreas';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';
import { LoaderContext } from '@/context/LoaderContext';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';

const mockPath = 'some-mock-path';
const mockReplace = vi.fn();

vi.mock('next/navigation', async () => {
  const originalModule = await vi.importActual('next/navigation');

  return {
    ...originalModule,
    usePathname: () => mockPath,
    useSearchParams: () => {},
    useRouter: vi.fn().mockImplementation(() => ({
      replace: mockReplace,
    })),
  };
});

const mockSetIsLoading = vi.fn();
const mockLoaderContext: LoaderContext = {
  getIsLoading: vi.fn(),
  setIsLoading: mockSetIsLoading,
};
vi.mock('@/context/LoaderContext', () => {
  return {
    useLoadingState: () => mockLoaderContext,
  };
});

let mockSearchState: SearchStateParams = {};
vi.mock('@/components/hooks/useSearchStateParams', () => ({
  useSearchStateParams: () => mockSearchState,
}));

const mockSearchStateWithSelectedAreas = {
  [SearchParams.AreasSelected]: ['E40000007', 'E40000012'],
};

const mockSearchStateWithNoSelectedAreas = {
  [SearchParams.AreasSelected]: [],
};

const helperText = 'To change, clear your selected areas';

describe('SelectAreasFilterPanel', () => {
  describe('Area type', () => {
    const areaTypeDropDownLabel =
      'Select a type of health or administrative area';

    it('should disable the select area type drop down when there are areas selected', () => {
      mockSearchState = mockSearchStateWithSelectedAreas;

      render(<SelectAreasFilterPanel />);

      expect(
        screen.getByRole('combobox', { name: areaTypeDropDownLabel })
      ).toBeDisabled();
    });

    it('should disable the select area type drop down when group area selected is ALL', () => {
      mockSearchState = {
        [SearchParams.GroupAreaSelected]: ALL_AREAS_SELECTED,
      };

      render(<SelectAreasFilterPanel />);

      expect(
        screen.getByRole('combobox', { name: areaTypeDropDownLabel })
      ).toBeDisabled();
    });

    it('should not disable the select area type drop down when there are no areas selected', () => {
      mockSearchState = mockSearchStateWithNoSelectedAreas;

      render(<SelectAreasFilterPanel />);

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
      mockSearchState = {
        [SearchParams.AreaTypeSelected]: 'nhs-regions',
      };

      render(
        <SelectAreasFilterPanel
          areaFilterData={{ availableAreaTypes: allAreaTypes }}
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
        `#${selectAreaTypeId}`,
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

    it('should call setIsLoading with true when an area type is selected', async () => {
      render(
        <SelectAreasFilterPanel
          areaFilterData={{ availableAreaTypes: allAreaTypes }}
        />
      );

      const user = userEvent.setup();
      await user.selectOptions(
        screen.getByRole('combobox', { name: areaTypeDropDownLabel }),
        'NHS Regions'
      );

      expect(mockSetIsLoading).toHaveBeenCalledWith(true);
    });

    it('should remove any previous state from the url for groupType and group selected when areaType is changed', async () => {
      mockSearchState = {
        [SearchParams.GroupTypeSelected]: 'england',
        [SearchParams.GroupSelected]: 'england',
      };

      const expectedPath = [
        `${mockPath}`,
        `?${SearchParams.AreaTypeSelected}=nhs-regions`,
        `#${selectAreaTypeId}`,
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

    it('should show helper text when areas are selected', () => {
      mockSearchState = mockSearchStateWithSelectedAreas;

      render(<SelectAreasFilterPanel />);

      expect(screen.getByText(helperText)).toBeInTheDocument();
    });
  });

  describe('Group type', () => {
    const availableGroupTypes: AreaType[] = [
      englandAreaType,
      nhsRegionsAreaType,
      nhsIntegratedCareBoardsAreaType,
    ];

    const groupTypeDropDownLabel = 'Select a type of group to compare with';

    it('should disable the select group type drop down when there are areas selected', () => {
      mockSearchState = mockSearchStateWithSelectedAreas;

      render(<SelectAreasFilterPanel />);

      expect(
        screen.getByRole('combobox', { name: groupTypeDropDownLabel })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('combobox', { name: groupTypeDropDownLabel })
      ).toBeDisabled();
    });

    it('should disable the select group type drop down when group area selected is ALL', () => {
      mockSearchState = {
        [SearchParams.GroupAreaSelected]: ALL_AREAS_SELECTED,
      };

      render(<SelectAreasFilterPanel />);

      expect(
        screen.getByRole('combobox', { name: groupTypeDropDownLabel })
      ).toBeDisabled();
    });

    it('should enable the select group type drop down when there are no areas selected', () => {
      mockSearchState = mockSearchStateWithNoSelectedAreas;

      render(<SelectAreasFilterPanel />);

      expect(
        screen.getByRole('combobox', { name: groupTypeDropDownLabel })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('combobox', { name: groupTypeDropDownLabel })
      ).not.toBeDisabled();
    });

    it('should render all applicable group types provided', () => {
      mockSearchState = {
        [SearchParams.AreaTypeSelected]: 'nhs-regions',
      };

      render(
        <SelectAreasFilterPanel
          areaFilterData={{
            availableAreaTypes: allAreaTypes,
            availableGroupTypes: availableGroupTypes,
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
      mockSearchState = {
        [SearchParams.AreaTypeSelected]: 'nhs-regions',
        [SearchParams.GroupTypeSelected]: 'england',
      };

      render(
        <SelectAreasFilterPanel
          areaFilterData={{
            availableAreaTypes: allAreaTypes,
            availableGroupTypes: availableGroupTypes,
          }}
        />
      );

      expect(
        screen.getByRole('combobox', { name: groupTypeDropDownLabel })
      ).toHaveTextContent('England');
    });

    it('should add the selected groupType to the url', async () => {
      mockSearchState = {
        [SearchParams.AreaTypeSelected]: 'nhs-regions',
      };

      const expectedPath = [
        `${mockPath}`,
        `?${SearchParams.AreaTypeSelected}=nhs-regions`,
        `&${SearchParams.GroupTypeSelected}=england`,
        `#${selectAreaGroupTypeId}`,
      ].join('');

      const user = userEvent.setup();

      render(
        <SelectAreasFilterPanel
          areaFilterData={{
            availableAreaTypes: allAreaTypes,
            availableGroupTypes: availableGroupTypes,
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

    it('should call setIsLoading with true when an group type is selected', async () => {
      mockSearchState = {
        [SearchParams.AreaTypeSelected]: 'nhs-regions',
      };

      render(
        <SelectAreasFilterPanel
          areaFilterData={{
            availableAreaTypes: allAreaTypes,
            availableGroupTypes: availableGroupTypes,
          }}
        />
      );

      const user = userEvent.setup();
      await user.selectOptions(
        screen.getByRole('combobox', { name: groupTypeDropDownLabel }),
        'England'
      );

      expect(mockSetIsLoading).toHaveBeenCalledWith(true);
    });

    it('should remove any previous state from the url for group selected when groupType is changed', async () => {
      mockSearchState = {
        [SearchParams.AreaTypeSelected]: 'nhs-regions',
        [SearchParams.GroupSelected]: 'england',
      };

      const expectedPath = [
        `${mockPath}`,
        `?${SearchParams.AreaTypeSelected}=nhs-regions`,
        `&${SearchParams.GroupTypeSelected}=england`,
        `#${selectAreaGroupTypeId}`,
      ].join('');

      const user = userEvent.setup();

      render(
        <SelectAreasFilterPanel
          areaFilterData={{
            availableAreaTypes: allAreaTypes,
            availableGroupTypes: availableGroupTypes,
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

    it('should disable the select group drop down when there are areas selected', () => {
      mockSearchState = mockSearchStateWithSelectedAreas;

      render(<SelectAreasFilterPanel />);

      expect(
        screen.getByRole('combobox', { name: groupDropDownLabel })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('combobox', { name: groupDropDownLabel })
      ).toBeDisabled();
    });

    it('should disable the select group drop down when group area selected is ALL', () => {
      mockSearchState = {
        [SearchParams.GroupAreaSelected]: ALL_AREAS_SELECTED,
      };

      render(<SelectAreasFilterPanel />);

      expect(
        screen.getByRole('combobox', { name: groupDropDownLabel })
      ).toBeDisabled();
    });

    it('should enable the select group type drop down when there are no areas selected', () => {
      mockSearchState = mockSearchStateWithNoSelectedAreas;

      render(<SelectAreasFilterPanel />);

      expect(
        screen.getByRole('combobox', { name: groupDropDownLabel })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('combobox', { name: groupDropDownLabel })
      ).not.toBeDisabled();
    });

    it('should render all applicable groups provided', () => {
      mockSearchState = {
        [SearchParams.AreaTypeSelected]: 'nhs-regions',
      };

      render(
        <SelectAreasFilterPanel
          areaFilterData={{
            availableAreaTypes: allAreaTypes,
            availableGroups: availableGroups,
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
      mockSearchState = {
        [SearchParams.AreaTypeSelected]: 'nhs-regions',
        [SearchParams.GroupTypeSelected]: 'england',
        [SearchParams.GroupSelected]: availableGroups[0].name,
      };

      render(
        <SelectAreasFilterPanel
          areaFilterData={{
            availableAreaTypes: allAreaTypes,
            availableGroups: availableGroups,
          }}
        />
      );

      expect(
        screen.getByRole('combobox', { name: groupDropDownLabel })
      ).toHaveTextContent(availableGroups[0].name);
    });

    it('should add the selected group to the url', async () => {
      mockSearchState = {
        [SearchParams.AreaTypeSelected]: 'nhs-regions',
      };

      const expectedPath = [
        `${mockPath}`,
        `?${SearchParams.AreaTypeSelected}=nhs-regions`,
        `&${SearchParams.GroupSelected}=${availableGroups[1].code}`,
        `#${selectAreaGroupId}`,
      ].join('');

      const user = userEvent.setup();

      render(
        <SelectAreasFilterPanel
          areaFilterData={{
            availableAreaTypes: allAreaTypes,
            availableGroups: availableGroups,
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

    it('should call setIsLoading with true when an group is selected', async () => {
      mockSearchState = {
        [SearchParams.AreaTypeSelected]: 'nhs-regions',
      };

      render(
        <SelectAreasFilterPanel
          areaFilterData={{
            availableAreaTypes: allAreaTypes,
            availableGroups: availableGroups,
          }}
        />
      );

      const user = userEvent.setup();
      await user.selectOptions(
        screen.getByRole('combobox', { name: groupDropDownLabel }),
        availableGroups[1].name
      );

      expect(mockSetIsLoading).toHaveBeenCalledWith(true);
    });
  });

  describe('Areas', () => {
    it('should show all the applicable areas as checkboxes including the select all areas checkbox', () => {
      mockSearchState = {
        [SearchParams.AreaTypeSelected]: 'nhs-regions',
      };

      const availableAreas = mockAvailableAreas['nhs-regions'];

      render(
        <SelectAreasFilterPanel
          areaFilterData={{
            availableAreaTypes: allAreaTypes,
            availableAreas: availableAreas,
          }}
        />
      );

      expect(screen.getAllByRole('checkbox')).toHaveLength(
        availableAreas.length + 1
      );

      availableAreas.forEach((area) => {
        expect(
          screen.getByRole('checkbox', { name: area.name })
        ).toBeInTheDocument();
      });
    });

    it('should have the checkboxes of the selected areas pre-selected', () => {
      mockSearchState = {
        [SearchParams.AreaTypeSelected]: 'nhs-regions',
        [SearchParams.AreasSelected]: ['E40000007', 'E40000012'],
      };

      const availableAreas = mockAvailableAreas['nhs-regions'];

      render(
        <SelectAreasFilterPanel
          areaFilterData={{
            availableAreaTypes: allAreaTypes,
            availableAreas: availableAreas,
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
      mockSearchState = {
        [SearchParams.AreaTypeSelected]: 'nhs-regions',
      };

      const expectedPath = [
        `${mockPath}`,
        `?${SearchParams.AreasSelected}=${eastEnglandNHSRegion.code}`,
        `&${SearchParams.AreaTypeSelected}=nhs-regions`,
        `#area-select-${eastEnglandNHSRegion.code}`,
      ].join('');
      const availableAreas = mockAvailableAreas['nhs-regions'];

      render(
        <SelectAreasFilterPanel
          areaFilterData={{
            availableAreaTypes: allAreaTypes,
            availableAreas: availableAreas,
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

    it('should remove any chart state when an area is selected', async () => {
      mockSearchState = {
        [SearchParams.AreaTypeSelected]: 'nhs-regions',
        [SearchParams.InequalityYearSelected]: '2022',
        [SearchParams.InequalityBarChartTypeSelected]: 'Some inequality type',
        [SearchParams.InequalityLineChartTypeSelected]:
          'Some other inequality type',
        [SearchParams.InequalityBarChartAreaSelected]:
          eastEnglandNHSRegion.code,
        [SearchParams.InequalityLineChartAreaSelected]: areaCodeForEngland,
        [SearchParams.PopulationAreaSelected]: areaCodeForEngland,
      };

      const expectedPath = [
        `${mockPath}`,
        `?${SearchParams.AreasSelected}=${eastEnglandNHSRegion.code}`,
        `&${SearchParams.AreaTypeSelected}=nhs-regions`,
        `#area-select-${eastEnglandNHSRegion.code}`,
      ].join('');
      const availableAreas = mockAvailableAreas['nhs-regions'];

      render(
        <SelectAreasFilterPanel
          areaFilterData={{
            availableAreaTypes: allAreaTypes,
            availableAreas: availableAreas,
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

    it('should call setIsLoading with true when an area is selected', async () => {
      mockSearchState = {
        [SearchParams.AreaTypeSelected]: 'nhs-regions',
      };

      const availableAreas = mockAvailableAreas['nhs-regions'];

      render(
        <SelectAreasFilterPanel
          areaFilterData={{
            availableAreaTypes: allAreaTypes,
            availableAreas: availableAreas,
          }}
        />
      );

      const user = userEvent.setup();
      await user.click(
        screen.getByRole('checkbox', { name: eastEnglandNHSRegion.name })
      );

      expect(mockSetIsLoading).toHaveBeenCalledWith(true);
    });

    it('should update the url when an area is de-selected', async () => {
      mockSearchState = {
        [SearchParams.AreaTypeSelected]: 'nhs-regions',
        [SearchParams.AreasSelected]: ['E40000007'],
      };

      const expectedPath = [
        `${mockPath}`,
        `?${SearchParams.AreaTypeSelected}=nhs-regions`,
        `#area-select-${eastEnglandNHSRegion.code}`,
      ].join('');
      const availableAreas = mockAvailableAreas['nhs-regions'];

      render(
        <SelectAreasFilterPanel
          areaFilterData={{
            availableAreaTypes: allAreaTypes,
            availableAreas: availableAreas,
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

    it('should remove any chart state when an area is de-selected', async () => {
      mockSearchState = {
        [SearchParams.AreaTypeSelected]: 'nhs-regions',
        [SearchParams.AreasSelected]: ['E40000007'],
        [SearchParams.InequalityYearSelected]: '2022',
        [SearchParams.InequalityBarChartTypeSelected]: 'Some inequality type',
        [SearchParams.InequalityLineChartTypeSelected]:
          'Some other inequality type',
        [SearchParams.InequalityBarChartAreaSelected]:
          eastEnglandNHSRegion.code,
        [SearchParams.InequalityLineChartAreaSelected]: areaCodeForEngland,
        [SearchParams.PopulationAreaSelected]: areaCodeForEngland,
      };

      const expectedPath = [
        `${mockPath}`,
        `?${SearchParams.AreaTypeSelected}=nhs-regions`,
        `#area-select-${eastEnglandNHSRegion.code}`,
      ].join('');
      const availableAreas = mockAvailableAreas['nhs-regions'];

      render(
        <SelectAreasFilterPanel
          areaFilterData={{
            availableAreaTypes: allAreaTypes,
            availableAreas: availableAreas,
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

    it('should update the url with group area selected when adding the area selected is the same length as all availableAreas', async () => {
      const availableAreas = mockAvailableAreas['nhs-regions'];
      const allRemainingAreasCode = availableAreas
        .filter((area) => area.code !== eastEnglandNHSRegion.code)
        .map((area) => area.code);

      mockSearchState = {
        [SearchParams.AreaTypeSelected]: 'nhs-regions',
        [SearchParams.AreasSelected]: allRemainingAreasCode,
      };

      const expectedPath = [
        `${mockPath}`,
        `?${SearchParams.AreaTypeSelected}=nhs-regions`,
        `&${SearchParams.GroupAreaSelected}=${ALL_AREAS_SELECTED}`,
        `#area-select-${eastEnglandNHSRegion.code}`,
      ].join('');

      render(
        <SelectAreasFilterPanel
          areaFilterData={{
            availableAreaTypes: allAreaTypes,
            availableAreas: availableAreas,
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

    it('should update the url with all the remaining areas selected when group area selected was provided and an area is de-selected', async () => {
      mockSearchState = {
        [SearchParams.AreaTypeSelected]: 'nhs-regions',
        [SearchParams.GroupAreaSelected]: ALL_AREAS_SELECTED,
      };

      const availableAreas = mockAvailableAreas['nhs-regions'];
      const allRemainingAreasCode = availableAreas
        .filter((area) => area.code !== eastEnglandNHSRegion.code)
        .map((area) => area.code);

      const expectedAreasSelected = allRemainingAreasCode.map((areaCode, i) => {
        const determineUrlPrefix = i === 0 ? '?' : '&';
        return `${determineUrlPrefix}${SearchParams.AreasSelected}=${areaCode}`;
      });

      const expectedPath = [
        `${mockPath}`,
        ...expectedAreasSelected,
        `&${SearchParams.AreaTypeSelected}=nhs-regions`,
        `#area-select-${eastEnglandNHSRegion.code}`,
      ].join('');

      render(
        <SelectAreasFilterPanel
          areaFilterData={{
            availableAreaTypes: allAreaTypes,
            availableAreas: availableAreas,
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

    it('should default the groupSelected to the first available groups when the groupSelected is in default state', async () => {
      mockSearchState = {
        [SearchParams.AreaTypeSelected]: nhsRegionsAreaType.key,
        [SearchParams.GroupTypeSelected]: regionsAreaType.key,
        [SearchParams.GroupSelected]: areaCodeForEngland,
      };

      const availableGroups = [eastEnglandNHSRegion, northWestNHSRegion];

      const expectedPath = [
        `${mockPath}`,
        `?${SearchParams.AreasSelected}=${eastEnglandNHSRegion.code}`,
        `&${SearchParams.AreaTypeSelected}=nhs-regions`,
        `&${SearchParams.GroupTypeSelected}=${regionsAreaType.key}`,
        `&${SearchParams.GroupSelected}=${availableGroups[0].code}`,
        `#area-select-${eastEnglandNHSRegion.code}`,
      ].join('');
      const availableAreas = mockAvailableAreas['nhs-regions'];

      render(
        <SelectAreasFilterPanel
          areaFilterData={{
            availableAreaTypes: allAreaTypes,
            availableAreas: availableAreas,
            availableGroups: availableGroups,
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

  describe('Select all areas', () => {
    const selectAllAreasCheckboxLabel = 'Select all areas';

    it('should show the select all areas checkbox', () => {
      mockSearchState = {
        [SearchParams.AreaTypeSelected]: 'nhs-regions',
      };

      const availableAreas = mockAvailableAreas['nhs-regions'];

      render(
        <SelectAreasFilterPanel
          areaFilterData={{
            availableAreaTypes: allAreaTypes,
            availableAreas: availableAreas,
          }}
        />
      );

      expect(
        screen.getByRole('checkbox', { name: selectAllAreasCheckboxLabel })
      ).toBeInTheDocument();
    });

    it('should have ALL the checkboxes pre-selected when group area selected provided in the searchState is set to ALL', () => {
      mockSearchState = {
        [SearchParams.AreaTypeSelected]: 'nhs-regions',
        [SearchParams.GroupAreaSelected]: ALL_AREAS_SELECTED,
      };

      const availableAreas = mockAvailableAreas['nhs-regions'];

      render(
        <SelectAreasFilterPanel
          areaFilterData={{
            availableAreaTypes: allAreaTypes,
            availableAreas: availableAreas,
          }}
        />
      );

      const allCheckboxes = screen.getAllByRole('checkbox');

      expect(allCheckboxes).toHaveLength(availableAreas.length + 1);
      allCheckboxes.forEach((checkbox) => {
        expect(checkbox).toBeChecked();
      });
    });

    it('should update the url when the select all areas checkbox is selected, replacing any areas previously selected', async () => {
      mockSearchState = {
        [SearchParams.AreaTypeSelected]: 'nhs-regions',
        [SearchParams.AreasSelected]: ['E40000007', 'E40000012'],
      };

      const expectedPath = [
        `${mockPath}`,
        `?${SearchParams.AreaTypeSelected}=nhs-regions`,
        `&${SearchParams.GroupAreaSelected}=ALL`,
      ].join('');
      const availableAreas = mockAvailableAreas['nhs-regions'];

      render(
        <SelectAreasFilterPanel
          areaFilterData={{
            availableAreaTypes: allAreaTypes,
            availableAreas: availableAreas,
          }}
        />
      );

      const user = userEvent.setup();
      await user.click(
        screen.getByRole('checkbox', { name: selectAllAreasCheckboxLabel })
      );

      expect(mockReplace).toHaveBeenCalledWith(expectedPath, {
        scroll: false,
      });
    });

    it('should remove any chart state when select all areas checkbox is selected', async () => {
      mockSearchState = {
        [SearchParams.AreaTypeSelected]: 'nhs-regions',
        [SearchParams.AreasSelected]: ['E40000007', 'E40000012'],
        [SearchParams.InequalityYearSelected]: '2022',
        [SearchParams.InequalityBarChartTypeSelected]: 'Some inequality type',
        [SearchParams.InequalityLineChartTypeSelected]:
          'Some other inequality type',
        [SearchParams.InequalityBarChartAreaSelected]:
          eastEnglandNHSRegion.code,
        [SearchParams.InequalityLineChartAreaSelected]: areaCodeForEngland,
        [SearchParams.PopulationAreaSelected]: areaCodeForEngland,
      };

      const expectedPath = [
        `${mockPath}`,
        `?${SearchParams.AreaTypeSelected}=nhs-regions`,
        `&${SearchParams.GroupAreaSelected}=ALL`,
      ].join('');
      const availableAreas = mockAvailableAreas['nhs-regions'];

      render(
        <SelectAreasFilterPanel
          areaFilterData={{
            availableAreaTypes: allAreaTypes,
            availableAreas: availableAreas,
          }}
        />
      );

      const user = userEvent.setup();
      await user.click(
        screen.getByRole('checkbox', { name: selectAllAreasCheckboxLabel })
      );

      expect(mockReplace).toHaveBeenCalledWith(expectedPath, {
        scroll: false,
      });
    });

    it('should call setIsLoading with true when select all areas checkbox is checked', async () => {
      mockSearchState = {
        [SearchParams.AreaTypeSelected]: 'nhs-regions',
      };

      const availableAreas = mockAvailableAreas['nhs-regions'];

      render(
        <SelectAreasFilterPanel
          areaFilterData={{
            availableAreaTypes: allAreaTypes,
            availableAreas: availableAreas,
          }}
        />
      );

      const user = userEvent.setup();
      await user.click(
        screen.getByRole('checkbox', { name: selectAllAreasCheckboxLabel })
      );

      expect(mockSetIsLoading).toHaveBeenCalledWith(true);
    });

    it('should update the url when select all areas checkbox is de-selected', async () => {
      mockSearchState = {
        [SearchParams.AreaTypeSelected]: 'nhs-regions',
        [SearchParams.GroupAreaSelected]: ALL_AREAS_SELECTED,
      };

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
        />
      );

      const user = userEvent.setup();
      await user.click(
        screen.getByRole('checkbox', { name: selectAllAreasCheckboxLabel })
      );

      expect(mockReplace).toHaveBeenCalledWith(expectedPath, {
        scroll: false,
      });
    });

    it('should remove any chart state when all areas checkbox is de-selected', async () => {
      mockSearchState = {
        [SearchParams.AreaTypeSelected]: 'nhs-regions',
        [SearchParams.GroupAreaSelected]: ALL_AREAS_SELECTED,
        [SearchParams.InequalityYearSelected]: '2022',
        [SearchParams.InequalityBarChartTypeSelected]: 'Some inequality type',
        [SearchParams.InequalityLineChartTypeSelected]:
          'Some other inequality type',
        [SearchParams.InequalityBarChartAreaSelected]:
          eastEnglandNHSRegion.code,
        [SearchParams.InequalityLineChartAreaSelected]: areaCodeForEngland,
        [SearchParams.PopulationAreaSelected]: areaCodeForEngland,
      };

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
        />
      );

      const user = userEvent.setup();
      await user.click(
        screen.getByRole('checkbox', { name: selectAllAreasCheckboxLabel })
      );

      expect(mockReplace).toHaveBeenCalledWith(expectedPath, {
        scroll: false,
      });
    });

    it('should default the groupSelected to the first available groups when the groupSelected is in default state', async () => {
      mockSearchState = {
        [SearchParams.AreaTypeSelected]: nhsRegionsAreaType.key,
        [SearchParams.GroupTypeSelected]: regionsAreaType.key,
        [SearchParams.GroupSelected]: areaCodeForEngland,
      };

      const availableGroups = [eastEnglandNHSRegion, northWestNHSRegion];

      const expectedPath = [
        `${mockPath}`,
        `?${SearchParams.AreaTypeSelected}=nhs-regions`,
        `&${SearchParams.GroupTypeSelected}=${regionsAreaType.key}`,
        `&${SearchParams.GroupSelected}=${availableGroups[0].code}`,
        `&${SearchParams.GroupAreaSelected}=ALL`,
      ].join('');
      const availableAreas = mockAvailableAreas['nhs-regions'];

      render(
        <SelectAreasFilterPanel
          areaFilterData={{
            availableAreaTypes: allAreaTypes,
            availableAreas: availableAreas,
            availableGroups: availableGroups,
          }}
        />
      );

      const user = userEvent.setup();
      await user.click(
        screen.getByRole('checkbox', { name: selectAllAreasCheckboxLabel })
      );

      expect(mockReplace).toHaveBeenCalledWith(expectedPath, {
        scroll: false,
      });
    });
  });

  describe('StyledRightClearAllLink', () => {
    it('should clear all selected areas when the clear all link is clicked', async () => {
      mockSearchState = {
        [SearchParams.AreaTypeSelected]: 'nhs-regions',
        [SearchParams.AreasSelected]: ['E40000007', 'E40000012'],
      };

      render(
        <SelectAreasFilterPanel
          areaFilterData={{
            availableAreaTypes: allAreaTypes,
            availableAreas: mockAvailableAreas['nhs-regions'],
          }}
        />
      );

      const user = userEvent.setup();

      const link = screen.getByTestId('clear-all-selected-areas-link');

      await user.click(link);

      expect(mockSetIsLoading).toHaveBeenCalledWith(true);
      expect(mockReplace).toHaveBeenCalledWith(
        `${mockPath}` + `?${SearchParams.AreaTypeSelected}=nhs-regions`,
        {
          scroll: false,
        }
      );
    });
  });
});
