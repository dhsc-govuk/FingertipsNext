import { render, screen, within } from '@testing-library/react';
import { BenchmarkSelectArea } from '.';
import { LoaderContext } from '@/context/LoaderContext';
import { SearchParams } from '@/lib/searchStateManager';
import userEvent from '@testing-library/user-event';
import { AreaWithoutAreaType } from '@/lib/common-types';

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
  const areaDropDownLabel = 'Select a benchmark';

  it('should render all the available areas', () => {
    render(
      <BenchmarkSelectArea
        availableAreas={mockAvailableAreas}
        benchmarkAreaSelectedKey={SearchParams.LineChartBenchmarkAreaSelected}
        searchState={{}}
      />
    );

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
    render(
      <BenchmarkSelectArea
        availableAreas={mockAvailableAreas}
        benchmarkAreaSelectedKey={SearchParams.LineChartBenchmarkAreaSelected}
        searchState={{ [SearchParams.InequalityBarChartAreaSelected]: 'A002' }}
      />
    );

    expect(
      screen.getByRole('combobox', {
        name: areaDropDownLabel,
      })
    ).toHaveTextContent(mockAvailableAreas[1].name);
  });

  it('should add the selected area for the chart to the url for the provided search param', async () => {
    const expectedPath = [
      `${mockPath}`,
      `?${SearchParams.LineChartBenchmarkAreaSelected}=${mockAvailableAreas[2].code}`,
    ].join('');

    const user = userEvent.setup();
    render(
      <BenchmarkSelectArea
        availableAreas={mockAvailableAreas}
        benchmarkAreaSelectedKey={SearchParams.LineChartBenchmarkAreaSelected}
        searchState={{}}
      />
    );

    await user.selectOptions(
      screen.getByRole('combobox', { name: areaDropDownLabel }),
      mockAvailableAreas[2].code
    );

    expect(mockReplace).toHaveBeenCalledWith(expectedPath, {
      scroll: false,
    });
  });
});
