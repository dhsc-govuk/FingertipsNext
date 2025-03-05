'use server';

import { z } from 'zod';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { redirect, RedirectType } from 'next/navigation';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';

const $IndicatorSelectionFormSchema = z.object({
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

  const { searchState, indicatorsSelected } = validatedFields.data;
  const state = JSON.parse(searchState);

  const areasSelected =
    state[SearchParams.AreasSelected]?.length > 0
      ? state[SearchParams.AreasSelected]
      : [areaCodeForEngland];

  const searchStateManager = SearchStateManager.initialise({
    ...state,
    [SearchParams.IndicatorsSelected]: indicatorsSelected,
    [SearchParams.AreasSelected]: areasSelected,
  });
  redirect(searchStateManager.generatePath('/chart'), RedirectType.push);
}
