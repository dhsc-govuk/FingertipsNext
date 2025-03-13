import { expect } from '@jest/globals';
import {
  searchIndicator,
  SearchFormState,
  getSearchSuggestions,
  getAreaDocument,
} from './searchActions';
import { mockDeep } from 'jest-mock-extended';
import { redirect, RedirectType } from 'next/navigation';
import { SearchParams } from '@/lib/searchStateManager';
import { SearchServiceFactory } from '@/lib/search/searchServiceFactory';
import { AreaDocument } from '@/lib/search/searchTypes';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';

jest.mock('next/navigation');
const redirectMock = jest.mocked(redirect);

beforeEach(() => {
  jest.clearAllMocks();
});

function* iteratorFromList<T>(list: T[]): IterableIterator<T> {
  for (const item of list) {
    yield item;
  }
}

const getMockFormData = (formData: Record<string, string>) =>
  mockDeep<FormData>({
    entries: jest.fn().mockImplementation(() => {
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

const initialStateWithoutAreas: SearchFormState = {
  indicator: 'some indicator',
  searchState: noAreasSelectedState,
};

const initialStateWithAreas: SearchFormState = {
  indicator: 'some indicator',
  searchState: areasSelectedState,
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
});

describe('getSearchSuggestions', () => {
  it('should return search suggestions', async () => {
    SearchServiceFactory.reset();
    process.env.DHSC_AI_SEARCH_USE_MOCK_SERVICE = 'true';
    const suggestions = await getSearchSuggestions('Springwood');
    expect(suggestions).toHaveLength(1);
    expect(suggestions[0]).toMatchObject({
      areaCode: 'A81005',
      areaName: 'Springwood Surgery',
      areaType: 'GPs',
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
    const getAreaDocumentMock = jest.fn().mockResolvedValue(mockAreaDocument);
    jest.spyOn(SearchServiceFactory, 'getAreaSearchService').mockReturnValue({
      getAreaDocument: getAreaDocumentMock,
      getAreaSuggestions: jest.fn(),
    });

    const area = await getAreaDocument('123');
    expect(area).toBeDefined();
    expect(area).toMatchObject(mockAreaDocument);
  });

  it('returns undefined when the getAreaDocument throws an exception', async () => {
    const getAreaDocumentMock = jest
      .fn()
      .mockImplementation((areaCode: string) => {
        throw new Error(`areaCode : ${areaCode} not found`);
      });
    jest.spyOn(SearchServiceFactory, 'getAreaSearchService').mockReturnValue({
      getAreaDocument: getAreaDocumentMock,
      getAreaSuggestions: jest.fn(),
    });

    const spyLog = jest.spyOn(console, 'log');

    const area = await getAreaDocument('123');
    expect(area).toBeUndefined();
    expect(spyLog).toHaveBeenCalled();
  });
});
