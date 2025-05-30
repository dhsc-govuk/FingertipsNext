'use server';

import { z } from 'zod';
import { redirect, RedirectType } from 'next/navigation';
import {
  SearchParams,
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';

const $IndicatorSearchFormSchema = z
  .object({
    searchState: z.string(),
    indicator: z.string(),
  })
  .refine((data) => {
    const stateParsed = JSON.parse(data.searchState);

    return (
      data.indicator.trim().length > 0 ||
      stateParsed[SearchParams.AreasSelected]?.length > 0
    );
  });

export type State = {
  errors?: {
    indicator?: string[];
  };
  message?: string | null;
};

export type IndicatorSearchForm = z.infer<typeof $IndicatorSearchFormSchema>;

export type IndicatorSearchFormState<T = IndicatorSearchForm> = State & T;

export async function searchIndicator(
  prevState: IndicatorSearchFormState,
  formData: FormData
): Promise<IndicatorSearchFormState> {
  const validatedFields = $IndicatorSearchFormSchema.safeParse({
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

  searchStateManager.removeAllParamFromState(SearchParams.IndicatorsSelected);

  redirect(searchStateManager.generatePath('/results'), RedirectType.push);
}
