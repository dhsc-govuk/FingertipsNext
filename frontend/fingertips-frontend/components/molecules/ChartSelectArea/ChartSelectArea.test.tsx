import { render, screen, within } from '@testing-library/react';
import { ChartSelectArea } from '.';
import { Area } from '@/generated-sources/ft-api-client';
import { englandAreaType } from '@/lib/areaFilterHelpers/areaType';
import { LoaderContext } from '@/context/LoaderContext';
import { SearchStateContext } from '@/context/SearchStateContext';
import { SearchParams } from '@/lib/searchStateManager';
import userEvent from '@testing-library/user-event';

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

const generateArea = (id: string): Area => {
  return {
    code: id,
    name: `some name with ${id}`,
    areaType: englandAreaType,
  };
};

const mockAvailableAreas = [
  generateArea('A001'),
  generateArea('A002'),
  generateArea('A003'),
];

describe('ChartSelectArea', () => {
  const areaDropDownLabel = 'Select an area';

  it('should render all the available areas', () => {
    render(<ChartSelectArea availableAreas={mockAvailableAreas} />);

    const areaSelectDropdown = screen.getByRole('combobox', {
      name: areaDropDownLabel,
    });

    const allOptions = within(areaSelectDropdown).getAllByRole('option');

    expect(areaSelectDropdown).toHaveLength(mockAvailableAreas.length);
    allOptions.forEach((option, i) => {
      expect(option.textContent).toEqual(mockAvailableAreas[i].name);
    });
  });

  it('should have the chart areaSelected as the pre-selected value', () => {
    mockGetSearchState.mockReturnValue({
      [SearchParams.InequalityBarChartAreaSelected]: 'A002',
    });

    render(<ChartSelectArea availableAreas={mockAvailableAreas} />);

    expect(
      screen.getByRole('combobox', {
        name: areaDropDownLabel,
      })
    ).toHaveTextContent(mockAvailableAreas[1].name);
  });

  it('should add the selected area for the chart to the url', async () => {
    const expectedPath = [
      `${mockPath}`,
      `?${SearchParams.InequalityBarChartAreaSelected}=${mockAvailableAreas[2].code}`,
    ].join('');

    const user = userEvent.setup();
    render(<ChartSelectArea availableAreas={mockAvailableAreas} />);

    await user.selectOptions(
      screen.getByRole('combobox', { name: areaDropDownLabel }),
      mockAvailableAreas[2].code
    );

    expect(mockReplace).toHaveBeenCalledWith(expectedPath, {
      scroll: false,
    });
  });
});
