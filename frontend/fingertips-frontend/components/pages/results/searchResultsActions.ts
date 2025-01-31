'use server';

import { z } from 'zod';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { redirect, RedirectType } from 'next/navigation';

const $SearchResultFormSchema = z.object({
  searchedIndicator: z.string().optional(),
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

export async function viewCharts(
  prevState: SearchResultState,
  formData: FormData
): Promise<SearchResultState> {
  const validatedFields = $SearchResultFormSchema.safeParse({
    searchedIndicator: formData.get('searchedIndicator'),
    indicatorsSelected: formData.getAll('indicator'),
  });

  if (!validatedFields.success) {
    return {
      searchedIndicator: formData.get('searchedIndicator')?.toString() ?? '',
      indicatorsSelected: formData.getAll('indicator')?.toString().split(','),
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please select at least one indicator',
    };
  }

  const { searchedIndicator, indicatorsSelected } = validatedFields.data;

  const searchState = new SearchStateManager({
    [SearchParams.SearchedIndicator]: searchedIndicator,
    [SearchParams.IndicatorsSelected]: indicatorsSelected,
  });
  redirect(searchState.generatePath('/chart'), RedirectType.push);
}
