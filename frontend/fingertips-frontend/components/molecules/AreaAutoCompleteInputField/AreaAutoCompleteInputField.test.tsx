import { render, screen, waitFor } from '@testing-library/react';
import { AreaAutoCompleteInputField } from './index';
import { SuggestionResult } from '@/lib/search/searchTypes';
import { getSearchSuggestions } from '@/components/forms/SearchForm/searchActions';
import userEvent from '@testing-library/user-event';
import { mockAreaDataForNHSRegion } from '@/mock/data/areaData';
import { eastEnglandNHSRegion } from '@/mock/data/areas/nhsRegionsAreas';
import { LoaderContext } from '@/context/LoaderContext';
import { SearchStateParams } from '@/lib/searchStateManager';
import { MockedFunction } from 'vitest';

vi.mock('@/components/forms/SearchForm/searchActions');

const mockGetSearchSuggestions = getSearchSuggestions as MockedFunction<
  typeof getSearchSuggestions
>;

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

const mockSearchState: SearchStateParams = {};
vi.mock('@/components/hooks/useSearchStateParams', () => ({
  useSearchStateParams: () => mockSearchState,
}));

describe('AreaAutoCompleteInputField', () => {
  const mockAreas: SuggestionResult[] = [
    {
      text: '*York*',
      document: { areaCode: '001', areaName: 'York', areaType: 'GPs' },
    },
    {
      text: 'North *York*shire',
      document: {
        areaCode: '002',
        areaName: 'North Yorkshire',
        areaType: 'GPs',
      },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the area search input field and not the area suggestion panel when first rendered', () => {
    render(<AreaAutoCompleteInputField inputFieldErrorStatus={false} />);

    expect(screen.getByTestId('area-search-input-field')).toBeInTheDocument();
    expect(
      screen.queryByTestId('area-suggestion-panel')
    ).not.toBeInTheDocument();
  });

  it('should render the areas suggested when the user types into the input field and search suggestions are provided', async () => {
    mockGetSearchSuggestions.mockResolvedValue(mockAreas);

    const user = userEvent.setup();

    render(<AreaAutoCompleteInputField inputFieldErrorStatus={false} />);

    await user.type(screen.getByRole('textbox', { name: /area/i }), 'some');
    await waitFor(() => {
      expect(screen.getByTestId('area-suggestion-panel')).toBeInTheDocument();
    });

    expect(screen.getAllByRole('listitem')).toHaveLength(mockAreas.length);
  });

  it('should pre-populate the search input field with the selected name provided', () => {
    render(
      <AreaAutoCompleteInputField
        inputFieldErrorStatus={false}
        selectedAreaName={
          mockAreaDataForNHSRegion[eastEnglandNHSRegion.code].name
        }
      />
    );

    expect(screen.getByRole('textbox', { name: /area/i })).toHaveValue(
      eastEnglandNHSRegion.name
    );
  });
});
