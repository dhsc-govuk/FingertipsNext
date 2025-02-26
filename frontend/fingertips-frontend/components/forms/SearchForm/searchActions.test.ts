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

const initialState: SearchFormState = {
  indicator: '',
};

describe('Search actions', () => {
  it('should redirect to search results with query param', async () => {
    const formData = getMockFormData({ indicator: 'boom' });

    await searchIndicator(initialState, formData);

    expect(redirectMock).toHaveBeenCalledWith(
      `/results?${SearchParams.SearchedIndicator}=boom`,
      RedirectType.push
    );
  });

  it('should return an appropriate message if no indicator is provided', async () => {
    const formData = getMockFormData({ indicator: '  ' });

    const state = await searchIndicator(initialState, formData);

    expect(state.indicator).toBe('');
    expect(state.message).toBe('Please enter a value for the indicator field');
  });

  it('should redirect to search result with query parameters- both for areaSelected and indicator', async () => {
    const formData = getMockFormData({
      areaSearched: 'EP0001',
      indicator: 'boom',
    });

    await searchIndicator(initialState, formData);
    expect(redirectMock).toHaveBeenCalledWith(
      `/results?${SearchParams.SearchedIndicator}=boom&${SearchParams.AreasSelected}=EP0001`,
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
    expect(area?.areaCode).toMatch(mockAreaDocument.areaCode);
    expect(area?.areaName).toMatch(mockAreaDocument.areaName);
    expect(area?.areaType).toMatch(mockAreaDocument.areaType);
  });

  it('throw exception when getAreaDocument is called', async () => {
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
