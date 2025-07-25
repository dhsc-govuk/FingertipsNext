import { mockDeep } from 'vitest-mock-extended';
import { redirect, RedirectType } from 'next/navigation';
import { SearchParams } from '@/lib/searchStateManager';
import {
  IndicatorSearchFormState,
  searchIndicator,
} from './indicatorSearchActions';

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

export const getMockFormData = (formData: Record<string, string>) =>
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

const initialStateWithoutAreas: IndicatorSearchFormState = {
  indicator: 'some indicator',
  searchState: noAreasSelectedState,
};

const initialStateWithAreas: IndicatorSearchFormState = {
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
