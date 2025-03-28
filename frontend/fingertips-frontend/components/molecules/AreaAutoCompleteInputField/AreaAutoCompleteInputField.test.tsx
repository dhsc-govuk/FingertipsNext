import { render, screen, waitFor } from '@testing-library/react';
import { AreaAutoCompleteInputField } from './index';
import { AreaDocument } from '@/lib/search/searchTypes';
import { getSearchSuggestions } from '@/components/forms/SearchForm/searchActions';
import userEvent from '@testing-library/user-event';
import { mockAreaDataForNHSRegion } from '@/mock/data/areaData';
import { eastEnglandNHSRegion } from '@/mock/data/areas/nhsRegionsAreas';
import { LoaderContext } from '@/context/LoaderContext';
import { SearchStateContext } from '@/context/SearchStateContext';

jest.mock('@/components/forms/SearchForm/searchActions');

const mockGetSearchSuggestions = getSearchSuggestions as jest.MockedFunction<
  typeof getSearchSuggestions
>;

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

const mockSearchStateContext: SearchStateContext = {
  getSearchState: jest.fn(),
  setSearchState: jest.fn(),
};
jest.mock('@/context/SearchStateContext', () => {
  return {
    useSearchState: () => mockSearchStateContext,
  };
});

describe('AreaAutoCompleteInputField', () => {
  const mockAreas: AreaDocument[] = [
    { areaCode: '001', areaName: 'London', areaType: 'GPs' },
    { areaCode: '002', areaName: 'Manchester', areaType: 'GPs' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
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
