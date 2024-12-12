import { expect } from '@jest/globals';
import { searchIndicator, SearchFormState } from './searchActions';
import { mockDeep } from 'jest-mock-extended';
import { redirect, RedirectType } from 'next/navigation';

jest.mock('next/navigation');
const redirectMock = jest.mocked(redirect);

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
      '/search/results?indicator=boom',
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
