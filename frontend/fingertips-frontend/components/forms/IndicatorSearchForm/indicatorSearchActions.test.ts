import { expect } from '@jest/globals';
import { mockDeep } from 'jest-mock-extended';
import { redirect, RedirectType } from 'next/navigation';
import { SearchParams } from '@/lib/searchStateManager';
import {
  IndicatorSearchFormState,
  searchIndicator,
} from './indicatorSearchActions';

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

const noAreasSelectedState = JSON.stringify({
  [SearchParams.AreasSelected]: [],
});

const areasSelectedState = JSON.stringify({
  [SearchParams.AreasSelected]: ['foo', 'bar'],
});

const initialStateWithoutAreas: IndicatorSearchFormState = {
  indicator: 'some indicator',
  searchState: noAreasSelectedState,
};

const initialStateWithAreas: IndicatorSearchFormState = {
  indicator: 'some indicator',
  searchState: areasSelectedState,
};

describe('Search actions', () => {
  it('should redirect to search results if indicator only is provided', async () => {
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

  it('should redirect to search results if areas only are provided', async () => {
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
