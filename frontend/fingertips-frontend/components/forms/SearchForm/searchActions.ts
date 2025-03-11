'use server';

import { z } from 'zod';
import { redirect, RedirectType } from 'next/navigation';
import {
  SearchParams,
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';
import { SearchServiceFactory } from '@/lib/search/searchServiceFactory';
import { AreaDocument } from '@/lib/search/searchTypes';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';

const $SearchFormSchema = z
  .object({
    searchState: z.string(),
    indicator: z.string(),
  })
  .refine((data) => {
    const stateParsed = JSON.parse(data.searchState);
    if (
      data.indicator.trim().length > 0 ||
      stateParsed[SearchParams.AreasSelected]?.length > 0 ||
      stateParsed[SearchParams.GroupAreaSelected] === ALL_AREAS_SELECTED
    ) {
      return true;
    }
    return false;
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
    searchState: formData.get('searchState'),
    indicator: formData.get('indicator'),
  });

  const searchStateParsed: SearchStateParams = JSON.parse(
    formData.get('searchState')?.toString() ?? `{}`
  );
  const searchStateManager = SearchStateManager.initialise({
    ...searchStateParsed,
  });

  if (!validatedFields.success) {
    return {
      searchState: formData.get('searchState')?.toString() ?? '',
      indicator: formData.get('indicator')?.toString().trim() ?? '',
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please enter an indicator ID or select at least one area',
    };
  }

  const { indicator } = validatedFields.data;

  searchStateManager.addParamValueToState(
    SearchParams.SearchedIndicator,
    indicator
  );

  redirect(searchStateManager.generatePath('/results'), RedirectType.push);
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
