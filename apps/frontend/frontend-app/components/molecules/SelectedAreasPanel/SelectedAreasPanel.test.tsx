import { mockAreaDataForNHSRegion } from '@/mock/data/areaData';
import { render, screen, within } from '@testing-library/react';
import { SelectedAreasPanel } from '.';
import { SearchParams } from '@/lib/searchStateManager';
import userEvent from '@testing-library/user-event';
import { nhsPrimaryCareNetworksAreaType } from '@/lib/areaFilterHelpers/areaType';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';
import { LoaderContext } from '@/context/LoaderContext';
import { SearchStateContext } from '@/context/SearchStateContext';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';

const mockSelectedAreasData = [
  mockAreaDataForNHSRegion['E40000007'],
  mockAreaDataForNHSRegion['E40000012'],
];

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

const mockSetIsLoading = jest.fn();
const mockLoaderContext: LoaderContext = {
  getIsLoading: jest.fn(),
  setIsLoading: mockSetIsLoading,
};
jest.mock('@/context/LoaderContext', () => {
  return {
    useLoadingState: () => mockLoaderContext,
  };
});

const mockGetSearchState = jest.fn();
const mockSearchStateContext: SearchStateContext = {
  getSearchState: mockGetSearchState,
  setSearchState: jest.fn(),
};
jest.mock('@/context/SearchStateContext', () => {
  return {
    useSearchState: () => mockSearchStateContext,
  };
});

describe('SelectedAreasPanel', () => {
  describe('When there is a group area selected', () => {
    beforeEach(() => {
      mockGetSearchState.mockReturnValue({
        [SearchParams.GroupAreaSelected]: ALL_AREAS_SELECTED,
        [SearchParams.AreaTypeSelected]: nhsPrimaryCareNetworksAreaType.key,
      });
    });

    it('snapshot test', () => {
      const container = render(
        <SelectedAreasPanel
          areaFilterData={{
            availableAreas: mockSelectedAreasData,
          }}
        />
      );

      expect(container.asFragment()).toMatchSnapshot();
    });

    it('should render the group area selected panel and not render the standard selected areas panel', () => {
      render(
        <SelectedAreasPanel
          areaFilterData={{
            availableAreas: mockSelectedAreasData,
          }}
        />
      );

      expect(
        screen.getByTestId('group-selected-areas-panel')
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId('standard-selected-areas-panel')
      ).not.toBeInTheDocument();
    });

    it('should render the selected areas count and single pill for the group area selected', () => {
      render(
        <SelectedAreasPanel
          areaFilterData={{
            availableAreas: mockSelectedAreasData,
          }}
        />
      );

      expect(screen.getByText(/Selected areas \(2\)/i)).toBeInTheDocument();
      expect(screen.getAllByTestId('pill-container')).toHaveLength(1);
    });

    it('should remove the group area selected from the url when the remove icon is clicked', async () => {
      const expectedPath = [
        `${mockPath}`,
        `?${SearchParams.AreaTypeSelected}=${nhsPrimaryCareNetworksAreaType.key}`,
      ].join('');

      const user = userEvent.setup();
      render(
        <SelectedAreasPanel
          areaFilterData={{
            availableAreas: mockSelectedAreasData,
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

    it('should call setIsLoading with true when an area type is selected', async () => {
      const user = userEvent.setup();
      render(
        <SelectedAreasPanel
          areaFilterData={{
            availableAreas: mockSelectedAreasData,
          }}
        />
      );

      const firstSelectedAreaPill = screen.getAllByTestId('pill-container')[0];
      await user.click(
        within(firstSelectedAreaPill).getByTestId('remove-icon-div')
      );

      expect(mockSetIsLoading).toHaveBeenCalledWith(true);
    });
  });

  describe('When there are areas selected', () => {
    beforeEach(() => {
      mockGetSearchState.mockReturnValue({});
    });

    it('snapshot test', () => {
      const container = render(
        <SelectedAreasPanel selectedAreasData={mockSelectedAreasData} />
      );

      expect(container.asFragment()).toMatchSnapshot();
    });

    it('should render the standard area selected panel and not render the group selected areas panel', () => {
      render(<SelectedAreasPanel />);

      expect(
        screen.queryByTestId('group-selected-areas-panel')
      ).not.toBeInTheDocument();
      expect(
        screen.getByTestId('standard-selected-areas-panel')
      ).toBeInTheDocument();
    });

    it('should not render the selected areas pill when there are no areas selected', () => {
      render(<SelectedAreasPanel />);

      expect(screen.getByText(/Selected areas \(0\)/i)).toBeInTheDocument();
      expect(screen.queryByTestId('pill-container')).not.toBeInTheDocument();
    });

    it('should render the selected areas when there are areas selected', () => {
      render(<SelectedAreasPanel selectedAreasData={mockSelectedAreasData} />);

      expect(screen.getByText(/Selected areas \(2\)/i)).toBeInTheDocument();
      expect(screen.getAllByTestId('pill-container')).toHaveLength(2);
    });

    it('should remove the area selected from the url when the remove icon is clicked for the area selected', async () => {
      mockGetSearchState.mockReturnValue({
        [SearchParams.AreasSelected]: ['E40000012', 'E40000007'],
        [SearchParams.AreaTypeSelected]: 'NHS Regions',
      });

      const expectedPath = [
        `${mockPath}`,
        `?${SearchParams.AreasSelected}=E40000012`,
        `&${SearchParams.AreaTypeSelected}=NHS+Regions`,
      ].join('');

      const user = userEvent.setup();
      render(<SelectedAreasPanel selectedAreasData={mockSelectedAreasData} />);

      const firstSelectedAreaPill = screen.getAllByTestId('pill-container')[0];
      await user.click(
        within(firstSelectedAreaPill).getByTestId('remove-icon-div')
      );

      expect(mockReplace).toHaveBeenCalledWith(expectedPath, {
        scroll: false,
      });
    });

    it('should remove any chart state when an area is de-selected', async () => {
      mockGetSearchState.mockReturnValue({
        [SearchParams.AreasSelected]: ['E40000012', 'E40000007'],
        [SearchParams.AreaTypeSelected]: 'NHS Regions',
        [SearchParams.InequalityYearSelected]: '2022',
        [SearchParams.InequalityBarChartTypeSelected]: 'Some inequality type',
        [SearchParams.InequalityLineChartTypeSelected]:
          'Some other inequality type',
        [SearchParams.InequalityBarChartAreaSelected]: 'E40000007',
        [SearchParams.InequalityLineChartAreaSelected]: areaCodeForEngland,
        [SearchParams.PopulationAreaSelected]: areaCodeForEngland,
      });

      const expectedPath = [
        `${mockPath}`,
        `?${SearchParams.AreasSelected}=E40000012`,
        `&${SearchParams.AreaTypeSelected}=NHS+Regions`,
      ].join('');

      const user = userEvent.setup();
      render(<SelectedAreasPanel selectedAreasData={mockSelectedAreasData} />);

      const firstSelectedAreaPill = screen.getAllByTestId('pill-container')[0];
      await user.click(
        within(firstSelectedAreaPill).getByTestId('remove-icon-div')
      );

      expect(mockReplace).toHaveBeenCalledWith(expectedPath, {
        scroll: false,
      });
    });

    it('should call setIsLoading with true when an area type is selected', async () => {
      mockGetSearchState.mockReturnValue({
        [SearchParams.AreasSelected]: ['E40000012', 'E40000007'],
        [SearchParams.AreaTypeSelected]: 'NHS Regions',
      });

      const user = userEvent.setup();
      render(<SelectedAreasPanel selectedAreasData={mockSelectedAreasData} />);

      const firstSelectedAreaPill = screen.getAllByTestId('pill-container')[0];
      await user.click(
        within(firstSelectedAreaPill).getByTestId('remove-icon-div')
      );

      expect(mockSetIsLoading).toHaveBeenCalledWith(true);
    });
  });
});
