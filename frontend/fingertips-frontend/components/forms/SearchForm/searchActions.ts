'use server';

import { z } from 'zod';
import { redirect, RedirectType } from 'next/navigation';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { SearchServiceFactory } from '@/lib/search/searchServiceFactory';
import { AreaDocument } from '@/lib/search/searchTypes';

const $SearchFormSchema = z.object({
  indicator: z
    .string()
    .trim()
    .min(1, { message: 'Please enter an indicator id' }),
  areaSearched: z.string().optional(),
  areaSelected: z.custom<AreaDocument | undefined>(),
});

export type State = {
  errors?: {
    indicator?: string[];
    areaSearched?: string[];
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
    areaSearched: formData.get('areaSearched'),
  });

  if (!validatedFields.success) {
    return {
      indicator: formData.get('indicator')?.toString().trim() ?? '',
      areaSearched: formData.get('areaSearched')?.toString().trim() ?? '',
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please enter a value for the indicator field',
    };
  }

  const { indicator, areaSearched } = validatedFields.data;

  const searchState = SearchStateManager.initialise({
    [SearchParams.SearchedIndicator]: indicator,
    [SearchParams.AreasSelected]: areaSearched ? [areaSearched] : [],
  });
  redirect(searchState.generatePath('/results'), RedirectType.push);
}

export async function getSearchSuggestions(
  partialAreaName: string
): Promise<AreaDocument[]> {
  try {
    return SearchServiceFactory.getAreaSearchService().getAreaSuggestions(
      partialAreaName
    );
  } catch (e) {
    console.log(e);
  }
  return [];
}

export async function getAreaDocument(
  areaCode: string
): Promise<AreaDocument | undefined> {
  try {
    return SearchServiceFactory.getAreaSearchService().getAreaDocument(
      areaCode
    );
  } catch (e) {
    console.log(e);
  }
  return undefined;
}
