'use server';

import { z } from 'zod';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { redirect, RedirectType } from 'next/navigation';

const $SearchResultFormSchema = z.object({
  searchState: z.string(),
  indicatorsSelected: z
    .string()
    .array()
    .min(1, { message: 'Please select at least one indicator' }),
});

export type State = {
  errors?: {
    indicatorsSelected?: string[];
  };
  message?: string | null;
};

export type SearchResultForm = z.infer<typeof $SearchResultFormSchema>;

export type SearchResultState<T = SearchResultForm> = State & T;

export async function submitIndicatorSelection(
  prevState: SearchResultState,
  formData: FormData
): Promise<SearchResultState> {
  const validatedFields = $SearchResultFormSchema.safeParse({
    searchState: formData.get('searchState'),
    indicatorsSelected: formData.getAll('indicator'),
  });

  if (!validatedFields.success) {
    return {
      searchState: formData.get('searchState')?.toString() ?? '',
      indicatorsSelected: formData.getAll('indicator')?.toString().split(','),
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please select at least one indicator',
    };
  }

  const { searchState, indicatorsSelected } = validatedFields.data;
  const state = JSON.parse(searchState);

  const searchStateManager = new SearchStateManager({
    ...state,
    [SearchParams.IndicatorsSelected]: indicatorsSelected,
  });
  redirect(searchStateManager.generatePath('/chart'), RedirectType.push);
}
