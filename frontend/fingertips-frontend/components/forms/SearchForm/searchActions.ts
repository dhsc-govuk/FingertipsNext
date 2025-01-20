'use server';

import { z } from 'zod';
import { redirect, RedirectType } from 'next/navigation';
import { SearchStateManager } from '@/lib/searchStateManager';
import { AreaSearchService } from '@/lib/search/areaSearchService';
import { AreaDocument } from '@/lib/search/searchTypes';
import { AreaSearchServiceMock } from '@/lib/search/areaSearchServiceMock';

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

export async function getSearchSuggestions(
  partialAreaName: string
): Promise<AreaDocument[]> {
  console.log(partialAreaName);
  console.log(process.env.DHSC_AI_SEARCH_USE_MOCK_SERVICE);
  try {
    const areaSearchService =
      process.env.DHSC_AI_SEARCH_USE_MOCK_SERVICE === 'true'
        ? AreaSearchServiceMock.getInstance()
        : AreaSearchService.getInstance();

    return areaSearchService.getAreaSuggestions(partialAreaName);
  } catch (e) {
    console.log(e);
  }
  return [];
}
