import { expect } from '@jest/globals';
import {
  searchIndicator,
  SearchFormState,
  getSearchSuggestions,
} from './searchActions';
import { mockDeep } from 'jest-mock-extended';
import { redirect, RedirectType } from 'next/navigation';
import { SearchParams } from '@/lib/searchStateManager';
import { SearchServiceFactory } from '@/lib/search/searchServiceFactory';

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

export const getMockFormData = (formData: Record<string, string>) =>
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
});

describe('getSearchSuggestions', () => {
  it('should return search suggestions', async () => {
    SearchServiceFactory.reset();
    process.env.DHSC_AI_SEARCH_USE_MOCK_SERVICE = 'true';
    expect(await getSearchSuggestions('Springwood')).toEqual([
      {
        areaCode: 'A81005',
        areaName: 'Springwood Surgery',
        areaType: 'GPs',
      },
    ]);
  });

  it('should return a maximum of 20 suggestions', async () => {
    SearchServiceFactory.reset();
    process.env.DHSC_AI_SEARCH_USE_MOCK_SERVICE = 'true';
    expect((await getSearchSuggestions('Surgery')).length).toEqual(20);
  });
});
