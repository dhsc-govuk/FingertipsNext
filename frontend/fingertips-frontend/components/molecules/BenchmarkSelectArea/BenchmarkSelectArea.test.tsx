import { render, screen, within } from '@testing-library/react';
import { BenchmarkSelectArea } from '.';
import { LoaderContext } from '@/context/LoaderContext';
import { SearchParams } from '@/lib/searchStateManager';
import userEvent from '@testing-library/user-event';
import { AreaWithoutAreaType } from '@/lib/common-types';
import { englandAreaType } from '@/lib/areaFilterHelpers/areaType';
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

const generateArea = (id: string): AreaWithoutAreaType => {
  return {
    code: id,
    name: `some name with ${id}`,
  };
};

const mockAvailableAreas = [
  generateArea('A001'),
  generateArea('A002'),
  generateArea('A003'),
];

describe('BenchmarkSelectArea', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const areaDropDownLabel = 'Select a benchmark for all charts';

  it('should render all the available areas', () => {
    render(<BenchmarkSelectArea availableAreas={mockAvailableAreas} />);

    const areaSelectDropdown = screen.getByRole('combobox', {
      name: areaDropDownLabel,
    });

    const allOptions = within(areaSelectDropdown).getAllByRole('option');

    expect(allOptions).toHaveLength(mockAvailableAreas.length);
    allOptions.forEach((option, i) => {
      expect(option.textContent).toEqual(mockAvailableAreas[i].name);
    });
  });

  it('should have the chart areaSelected as the pre-selected value', () => {
    render(<BenchmarkSelectArea availableAreas={mockAvailableAreas} />);

    expect(
      screen.getByRole('combobox', {
        name: areaDropDownLabel,
      })
    ).toHaveTextContent(mockAvailableAreas[1].name);
  });

  it('should add the selected area for the chart to the url for the provided search param', async () => {
    const expectedPath = [
      `${mockPath}`,
      `?${SearchParams.AreaTypeSelected}=${englandAreaType.key}`,
      `&${SearchParams.GroupTypeSelected}=${englandAreaType.key}`,
      `&${SearchParams.GroupSelected}=${areaCodeForEngland}`,
      `&${SearchParams.BenchmarkAreaSelected}=${mockAvailableAreas[2].code}`,
    ].join('');

    const user = userEvent.setup();
    render(<BenchmarkSelectArea availableAreas={mockAvailableAreas} />);

    await user.selectOptions(
      screen.getByRole('combobox', { name: areaDropDownLabel }),
      mockAvailableAreas[2].code
    );

    expect(mockReplace).toHaveBeenCalledWith(expectedPath, {
      scroll: false,
    });
  });
});
