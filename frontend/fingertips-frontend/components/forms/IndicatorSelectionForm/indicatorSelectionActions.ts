'use server';

import { z } from 'zod';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { redirect, RedirectType } from 'next/navigation';

const $IndicatorSelectionFormSchema = z
  .object({
    searchState: z.string(),
    indicatorsSelected: z.array(z.string()).optional(),
  })
  .refine((data) => {
    const stateParsed = JSON.parse(data.searchState);
    return stateParsed[SearchParams.IndicatorsSelected]?.length > 0;
  });

export type State = {
  errors?: {
    indicatorsSelected?: string[];
  };
  message?: string | null;
};

export type IndicatorSelectionForm = z.infer<
  typeof $IndicatorSelectionFormSchema
>;

export type IndicatorSelectionState<T = IndicatorSelectionForm> = State & T;

export async function submitIndicatorSelection(
  prevState: IndicatorSelectionState,
  formData: FormData
): Promise<IndicatorSelectionState> {
  const validatedFields = $IndicatorSelectionFormSchema.safeParse({
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

  const { searchState } = validatedFields.data;
  const state = JSON.parse(searchState);

  const searchStateManager = SearchStateManager.initialise(state);

  redirect(searchStateManager.generatePath('/chart'), RedirectType.push);
}
