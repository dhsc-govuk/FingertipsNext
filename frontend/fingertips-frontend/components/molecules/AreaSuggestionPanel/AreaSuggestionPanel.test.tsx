import { render, screen } from '@testing-library/react';
import { AreaAutoCompleteSuggestionPanel } from './index';
import { AreaDocument } from '@/lib/search/searchTypes';
import { SearchParams } from '@/lib/searchStateManager';
import userEvent from '@testing-library/user-event';
import {
  englandAreaType,
  nhsRegionsAreaType,
} from '@/lib/areaFilterHelpers/areaType';
import { englandArea } from '@/mock/data/areas/englandAreas';
import { LoaderContext } from '@/context/LoaderContext';
import { SearchStateContext } from '@/context/SearchStateContext';

const mockAreas: AreaDocument[] = [
  { areaCode: 'GP01', areaName: 'Greenwich', areaType: 'GPs' },
  { areaCode: 'GP02', areaName: 'Cambridge', areaType: 'GPs' },
  { areaCode: 'CT01', areaName: 'Central London', areaType: 'CT' },
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

describe('AreaSuggestionPanel', () => {
  beforeEach(() => {
    mockGetSearchState.mockReturnValue({});
  });

  it('should render correctly and match snapshot', () => {
    const { asFragment } = render(
      <AreaAutoCompleteSuggestionPanel
        suggestedAreas={mockAreas}
        searchHint=""
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('should not render the area suggestion panel when the searchState contains areasSelected', () => {
    mockGetSearchState.mockReturnValue({
      [SearchParams.AreasSelected]: ['A001'],
    });

    render(
      <AreaAutoCompleteSuggestionPanel suggestedAreas={[]} searchHint="" />
    );

    expect(
      screen.queryByTestId('area-suggestion-panel')
    ).not.toBeInTheDocument();
  });

  it('should render the suggestedAreas provided', () => {
    render(
      <AreaAutoCompleteSuggestionPanel
        suggestedAreas={mockAreas}
        searchHint=""
      />
    );

    mockAreas.forEach((mockArea) => {
      expect(
        screen.getByTestId(`area-suggestion-item-${mockArea.areaCode}`)
      ).toBeInTheDocument();
    });
  });

  it('should render nothing if suggestedAreas are empty', () => {
    const { container } = render(
      <AreaAutoCompleteSuggestionPanel suggestedAreas={[]} searchHint="Lo" />
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
    render(
      <AreaAutoCompleteSuggestionPanel
        suggestedAreas={mockAreas}
        searchHint=""
      />
    );

    await user.click(
      screen.getByTestId(`area-suggestion-item-${mockAreas[0].areaCode}`)
    );

    expect(mockReplace).toHaveBeenCalledWith(expectedPath, { scroll: false });
  });

  it('should call setIsLoading with true when a suggested area is clicked', async () => {
    render(
      <AreaAutoCompleteSuggestionPanel
        suggestedAreas={mockAreas}
        searchHint=""
      />
    );

    const user = userEvent.setup();
    await user.click(
      screen.getByTestId(`area-suggestion-item-${mockAreas[0].areaCode}`)
    );

    expect(mockSetIsLoading).toHaveBeenCalledWith(true);
  });

  it('should remove any previous area filter selection from the state', async () => {
    mockGetSearchState.mockReturnValue({
      [SearchParams.AreaTypeSelected]: nhsRegionsAreaType.key,
      [SearchParams.GroupTypeSelected]: englandAreaType.key,
      [SearchParams.GroupSelected]: englandArea.code,
    });

    const expectedPath = [
      `${mockPath}`,
      `?${SearchParams.AreasSelected}=GP01`,
      `&${SearchParams.AreaTypeSelected}=gps`,
    ].join('');

    const user = userEvent.setup();
    render(
      <AreaAutoCompleteSuggestionPanel
        suggestedAreas={mockAreas}
        searchHint=""
      />
    );

    await user.click(
      screen.getByTestId(`area-suggestion-item-${mockAreas[0].areaCode}`)
    );

    expect(mockReplace).toHaveBeenCalledWith(expectedPath, { scroll: false });
  });
});
