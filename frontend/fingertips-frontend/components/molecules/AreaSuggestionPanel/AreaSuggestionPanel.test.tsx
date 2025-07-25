import { render, screen } from '@testing-library/react';
import { AreaAutoCompleteSuggestionPanel } from './index';
import { SuggestionResult } from '@/lib/search/searchTypes';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import userEvent from '@testing-library/user-event';
import {
  englandAreaType,
  nhsRegionsAreaType,
} from '@/lib/areaFilterHelpers/areaType';
import { englandArea } from '@/mock/data/areas/englandAreas';
import { LoaderContext } from '@/context/LoaderContext';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';

const mockAreas: SuggestionResult[] = [
  {
    text: '*York*',
    document: { areaCode: 'GP01', areaName: 'York', areaType: 'GPs' },
  },
  {
    text: 'North *York*shire',
    document: {
      areaCode: 'GP02',
      areaName: 'North Yorkshire',
      areaType: 'GPs',
    },
  },
  {
    text: 'South *York*shire',
    document: { areaCode: 'CT01', areaName: 'South Yorkshire', areaType: 'CT' },
  },
];

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

const searchState: SearchStateParams = {};
vi.mock('@/components/hooks/useSearchStateParams', () => ({
  useSearchStateParams: () => searchState,
}));

describe('AreaSuggestionPanel', () => {
  beforeEach(() => {
    mockReplace.mockClear();
    searchState[SearchParams.AreasSelected] = [];
  });

  it('should render correctly and match snapshot', () => {
    const { asFragment } = render(
      <AreaAutoCompleteSuggestionPanel suggestedAreas={mockAreas} />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('should not render the area suggestion panel when the searchState contains areasSelected', () => {
    searchState[SearchParams.AreasSelected] = ['A001'];

    render(<AreaAutoCompleteSuggestionPanel suggestedAreas={[]} />);

    expect(
      screen.queryByTestId('area-suggestion-panel')
    ).not.toBeInTheDocument();
  });

  it('should render the suggestedAreas provided', () => {
    render(<AreaAutoCompleteSuggestionPanel suggestedAreas={mockAreas} />);

    mockAreas.forEach((mockArea) => {
      expect(
        screen.getByTestId(`area-suggestion-item-${mockArea.document.areaCode}`)
      ).toBeInTheDocument();
    });
  });

  it('should render nothing if suggestedAreas are empty', () => {
    const { container } = render(
      <AreaAutoCompleteSuggestionPanel suggestedAreas={[]} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should update the url with the areaCode and areaType when a suggested area is clicked', async () => {
    const expectedPath = [
      `${mockPath}`,
      `?${SearchParams.AreasSelected}=GP01`,
      `&${SearchParams.AreaTypeSelected}=gps`,
    ].join('');

    const user = userEvent.setup();
    render(<AreaAutoCompleteSuggestionPanel suggestedAreas={mockAreas} />);

    await user.click(
      screen.getByTestId(
        `area-suggestion-item-${mockAreas[0].document.areaCode}`
      )
    );

    expect(mockReplace).toHaveBeenCalledWith(expectedPath, { scroll: false });
  });

  it('should call setIsLoading with true when a suggested area is clicked', async () => {
    render(<AreaAutoCompleteSuggestionPanel suggestedAreas={mockAreas} />);

    const user = userEvent.setup();
    await user.click(
      screen.getByTestId(
        `area-suggestion-item-${mockAreas[0].document.areaCode}`
      )
    );

    expect(mockSetIsLoading).toHaveBeenCalledWith(true);
  });

  it('should remove any previous area filter selection from the state', async () => {
    searchState[SearchParams.AreaTypeSelected] = nhsRegionsAreaType.key;
    searchState[SearchParams.GroupTypeSelected] = englandAreaType.key;
    searchState[SearchParams.GroupSelected] = englandArea.code;

    const expectedPath = [
      `${mockPath}`,
      `?${SearchParams.AreasSelected}=GP01`,
      `&${SearchParams.AreaTypeSelected}=gps`,
    ].join('');

    const user = userEvent.setup();
    render(<AreaAutoCompleteSuggestionPanel suggestedAreas={mockAreas} />);

    await user.click(
      screen.getByTestId(
        `area-suggestion-item-${mockAreas[0].document.areaCode}`
      )
    );

    expect(mockReplace).toHaveBeenCalledWith(expectedPath, { scroll: false });
  });

  it('should set group areas selected to all when england selected', async () => {
    const expectedPath = [
      `${mockPath}`,
      `?${SearchParams.AreasSelected}=${areaCodeForEngland}`,
      `&${SearchParams.AreaTypeSelected}=${englandAreaType.key}`,
      `&${SearchParams.GroupTypeSelected}=${englandAreaType.key}`,
      `&${SearchParams.GroupSelected}=${areaCodeForEngland}`,
      `&${SearchParams.GroupAreaSelected}=${ALL_AREAS_SELECTED}`,
    ].join('');

    const user = userEvent.setup();
    render(
      <AreaAutoCompleteSuggestionPanel
        suggestedAreas={[
          {
            text: '',
            document: {
              areaCode: areaCodeForEngland,
              areaName: 'England',
              areaType: englandAreaType.key,
            },
          },
        ]}
      />
    );

    await user.click(
      screen.getByTestId(`area-suggestion-item-${areaCodeForEngland}`)
    );

    expect(mockReplace).toHaveBeenCalledWith(expectedPath, { scroll: false });
  });
});
