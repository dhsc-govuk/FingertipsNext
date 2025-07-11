import {
  searchIndicator,
  SearchFormState,
  getSearchSuggestions,
  getAreaDocument,
} from './searchActions';
import { mockDeep } from 'vitest-mock-extended';
import { redirect, RedirectType } from 'next/navigation';
import { SearchParams } from '@/lib/searchStateManager';
import { SearchServiceFactory } from '@/lib/search/searchServiceFactory';
import { AreaDocument } from '@/lib/search/searchTypes';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';
import { IndicatorSearchFormState } from '@/components/forms/IndicatorSearchForm/indicatorSearchActions';

vi.mock('next/navigation');
const redirectMock = vi.mocked(redirect);

beforeEach(() => {
  vi.clearAllMocks();
});

function* iteratorFromList<T>(list: T[]): IterableIterator<T> {
  for (const item of list) {
    yield item;
  }
}

const getMockFormData = (formData: Record<string, string>) =>
  mockDeep<FormData>({
    entries: vi.fn().mockImplementation(() => {
      const formDataEntries = Object.entries(formData);

      return iteratorFromList(formDataEntries);
    }),
    get: (key: string) => formData[key],
  });

const noAreasSelectedState = JSON.stringify({
  [SearchParams.AreasSelected]: [],
});

const areasSelectedState = JSON.stringify({
  [SearchParams.AreasSelected]: ['foo', 'bar'],
});

const indicatorsSelectedState = JSON.stringify({
  [SearchParams.IndicatorsSelected]: ['1', '2'],
});

const initialStateWithoutAreas: SearchFormState = {
  indicator: 'some indicator',
  searchState: noAreasSelectedState,
};

const initialStateWithAreas: SearchFormState = {
  indicator: 'some indicator',
  searchState: areasSelectedState,
};

const initialStateWithIndicatorsSelected: IndicatorSearchFormState = {
  indicator: 'some indicator',
  searchState: indicatorsSelectedState,
};

describe('Search actions', () => {
  it('should redirect to search results if only indicator is provided', async () => {
    const formData = getMockFormData({
      indicator: 'boom',
      searchState: noAreasSelectedState,
    });

    await searchIndicator(initialStateWithoutAreas, formData);

    expect(redirectMock).toHaveBeenCalledWith(
      `/results?${SearchParams.SearchedIndicator}=boom`,
      RedirectType.push
    );
  });

  it('should redirect to search results if only areas are provided', async () => {
    const formData = getMockFormData({
      indicator: '',
      searchState: areasSelectedState,
    });

    await searchIndicator(initialStateWithoutAreas, formData);

    expect(redirectMock).toHaveBeenCalledWith(
      `/results?${SearchParams.AreasSelected}=foo&${SearchParams.AreasSelected}=bar`,
      RedirectType.push
    );
  });

  it('should redirect to search results if only a group area is selected', async () => {
    const formData = getMockFormData({
      indicator: '',
      searchState: JSON.stringify({
        [SearchParams.GroupAreaSelected]: ALL_AREAS_SELECTED,
      }),
    });

    await searchIndicator(initialStateWithoutAreas, formData);

    expect(redirectMock).toHaveBeenCalledWith(
      `/results?${SearchParams.GroupAreaSelected}=${ALL_AREAS_SELECTED}`,
      RedirectType.push
    );
  });

  it('should redirect to search results if indicator and areas are provided', async () => {
    const formData = getMockFormData({
      indicator: 'boom',
      searchState: areasSelectedState,
    });

    await searchIndicator(initialStateWithAreas, formData);

    expect(redirectMock).toHaveBeenCalledWith(
      `/results?${SearchParams.SearchedIndicator}=boom&${SearchParams.AreasSelected}=foo&${SearchParams.AreasSelected}=bar`,
      RedirectType.push
    );
  });

  it('should return an appropriate message if no indicator and no areas are provided', async () => {
    const formData = getMockFormData({
      indicator: '',
      searchState: noAreasSelectedState,
    });

    const state = await searchIndicator(initialStateWithoutAreas, formData);

    expect(state.indicator).toBe('');
    expect(state.message).toBe(
      'Please enter an indicator ID or select at least one area'
    );
  });

  it('should redirect to search results and remove any indicators selected from URL', async () => {
    const formData = getMockFormData({
      indicator: 'boom',
      searchState: indicatorsSelectedState,
    });

    await searchIndicator(initialStateWithIndicatorsSelected, formData);

    expect(redirectMock).toHaveBeenCalledWith(
      `/results?${SearchParams.SearchedIndicator}=boom`,
      RedirectType.push
    );
  });
});

describe('getSearchSuggestions', () => {
  it('should return search suggestions', async () => {
    SearchServiceFactory.reset();
    process.env.DHSC_AI_SEARCH_USE_MOCK_SERVICE = 'true';
    const suggestions = await getSearchSuggestions('Springwood');
    expect(suggestions).toHaveLength(1);
    expect(suggestions[0]).toMatchObject({
      text: '*Springwood*',
      document: {
        areaCode: 'A81005',
        areaName: 'Springwood Surgery',
        areaType: 'GPs',
        postcode: 'TS14 7DJ',
      },
    });
  });

  it('should return a maximum of 20 suggestions', async () => {
    SearchServiceFactory.reset();
    process.env.DHSC_AI_SEARCH_USE_MOCK_SERVICE = 'true';
    expect(await getSearchSuggestions('Surgery')).toHaveLength(20);
  });
});

describe('getAreaDocument', () => {
  const mockAreaCode = '123';
  const mockAreaDocument: AreaDocument = {
    areaCode: mockAreaCode,
    areaName: 'Test Area',
    areaType: 'Urban',
  };

  it('should return the area document when getAreaDocument succeeds', async () => {
    const getAreaDocumentMock = vi.fn().mockResolvedValue(mockAreaDocument);
    vi.spyOn(SearchServiceFactory, 'getAreaSearchService').mockReturnValue({
      getAreaDocument: getAreaDocumentMock,
      getAreaSuggestions: vi.fn(),
    });

    const area = await getAreaDocument('123');
    expect(area).toBeDefined();
    expect(area).toMatchObject(mockAreaDocument);
  });

  it('returns undefined when getAreaDocument throws an exception', async () => {
    const getAreaDocumentMock = vi
      .fn()
      .mockImplementation((areaCode: string) => {
        throw new Error(`areaCode : ${areaCode} not found`);
      });
    vi.spyOn(SearchServiceFactory, 'getAreaSearchService').mockReturnValue({
      getAreaDocument: getAreaDocumentMock,
      getAreaSuggestions: vi.fn(),
    });

    const spyLog = vi.spyOn(console, 'error').mockImplementation(() => {});

    const area = await getAreaDocument('123');
    expect(area).toBeUndefined();
    expect(spyLog).toHaveBeenCalled();
  });
});
