import { searchIndicator, SearchFormState } from './searchActions';
import { mockDeep } from 'jest-mock-extended';
import { redirect } from 'next/navigation';

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
  indicator: 'boom',
};

describe('Search actions', () => {
  it('should redirect to search with query param', async () => {
    const formData = getMockFormData({ indicator: 'boom' });

    await searchIndicator(initialState, formData);

    expect(redirectMock).toHaveBeenCalledWith('/search/results?indicator=boom');
  });
});
