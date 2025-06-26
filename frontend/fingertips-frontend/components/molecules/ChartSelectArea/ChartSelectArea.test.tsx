import { render, screen, within } from '@testing-library/react';
import { ChartSelectArea } from '.';
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

describe('ChartSelectArea', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const areaDropDownLabel = 'Select an area';

  it('should render all the available areas', () => {
    render(
      <ChartSelectArea
        availableAreas={mockAvailableAreas}
        chartAreaSelectedKey={SearchParams.InequalityBarChartAreaSelected}
      />
    );

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
    render(
      <ChartSelectArea
        availableAreas={mockAvailableAreas}
        chartAreaSelectedKey={SearchParams.InequalityBarChartAreaSelected}
      />
    );

    expect(
      screen.getByRole('combobox', {
        name: areaDropDownLabel,
      })
    ).toHaveTextContent(mockAvailableAreas[1].name);
  });

  it('should add the selected area for the chart to the url for the provided search param', async () => {
    const spy = vi.spyOn(window.history, 'pushState');
    const expectedPath = [
      `${mockPath}`,
      `?${SearchParams.AreaTypeSelected}=${englandAreaType.key}`,
      `&${SearchParams.GroupTypeSelected}=${englandAreaType.key}`,
      `&${SearchParams.GroupSelected}=${areaCodeForEngland}`,
      `&${SearchParams.InequalityLineChartAreaSelected}=${mockAvailableAreas[2].code}`,
    ].join('');

    const user = userEvent.setup();
    render(
      <ChartSelectArea
        availableAreas={mockAvailableAreas}
        chartAreaSelectedKey={SearchParams.InequalityLineChartAreaSelected}
      />
    );

    await user.selectOptions(
      screen.getByRole('combobox', { name: areaDropDownLabel }),
      mockAvailableAreas[2].code
    );

    expect(spy).toHaveBeenCalledWith(null, '', expectedPath);
  });

  it.each([
    SearchParams.InequalityLineChartAreaSelected,
    SearchParams.InequalityBarChartAreaSelected,
  ])(
    'should alter the browser history state when param type is %s',
    async (chartAreaSelectedKey) => {
      const spy = vi.spyOn(window.history, 'pushState');

      render(
        <ChartSelectArea
          availableAreas={mockAvailableAreas}
          chartAreaSelectedKey={chartAreaSelectedKey}
        />
      );

      await userEvent.selectOptions(
        screen.getByRole('combobox', { name: areaDropDownLabel }),
        mockAvailableAreas[2].code
      );

      expect(spy).toHaveBeenCalledWith(
        null,
        '',
        `some-mock-path?ats=england&gts=england&gs=E92000001&${chartAreaSelectedKey}=${mockAvailableAreas[2].code}`
      );
    }
  );
});
