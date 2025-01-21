'use server';

import { z } from 'zod';
import { redirect, RedirectType } from 'next/navigation';
import { SearchStateManager } from '@/lib/searchStateManager';

import mockAreaData from '../../../assets/areaData.json';
import { AreaSearchService } from '@/lib/search/areaSearchService';
import { AreaSearchServiceMock } from '@/lib/search/areaSearchServiceMock';
import { IAreaSearchService, AreaDocument } from '@/lib/search/searchTypes';

const $SearchFormSchema = z.object({
  indicator: z
    .string()
    .trim()
    .min(1, { message: 'Please enter an indicator id' }),
});

export type State = {
  errors?: {
    indicator?: string[];
  };
  message?: string | null;
};

export type SearchForm = z.infer<typeof $SearchFormSchema>;

export type SearchFormState<T = SearchForm> = State & T;

export async function searchIndicator(
  prevState: SearchFormState,
  formData: FormData
): Promise<SearchFormState> {
  const validatedFields = $SearchFormSchema.safeParse({
    indicator: formData.get('indicator'),
  });

  if (!validatedFields.success) {
    return {
      indicator: formData.get('indicator')?.toString().trim() ?? '',
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please enter a value for the indicator field',
    };
  }

  const { indicator } = validatedFields.data;

  const searchState = new SearchStateManager({ searchedIndicator: indicator });
  redirect(searchState.generatePath('/search/results'), RedirectType.push);
}

function getAreaSearchClient(): IAreaSearchService {
  try {
    return process.env.DHSC_AI_SEARCH_USE_MOCK_SERVICE === 'true'
      ? AreaSearchServiceMock.getInstance()
      : AreaSearchService.getInstance();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_err) {
    return process.env.DHSC_AI_SEARCH_USE_MOCK_SERVICE === 'true'
      ? new AreaSearchServiceMock(mockAreaData)
      : new AreaSearchService(
          process.env.DHSC_AI_SEARCH_SERVICE_URL!,
          process.env.DHSC_AI_SEARCH_API_KEY!
        );
  }
}

export async function getSearchSuggestions(
  partialAreaName: string
): Promise<AreaDocument[]> {
  try {
    return getAreaSearchClient().getAreaSuggestions(partialAreaName);
  } catch (e) {
    console.log(e);
  }
  return [];
}
