'use server';

import { z } from 'zod';
import { redirect, RedirectType } from 'next/navigation';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';

const $IndicatorSearchFormSchema = z.object({
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
  areasSelected?: string[];
};

export type IndicatorSearchForm = z.infer<typeof $IndicatorSearchFormSchema>;

export type IndicatorSearchFormState<T = IndicatorSearchForm> = State & T;

export async function searchIndicator(
  prevState: IndicatorSearchFormState,
  formData: FormData
): Promise<IndicatorSearchFormState> {
  const validatedField = $IndicatorSearchFormSchema.safeParse({
    indicator: formData.get('indicator'),
  });

  if (!validatedField.success && prevState.areasSelected?.length === 0) {
    return {
      indicator: formData.get('indicator')?.toString().trim() ?? '',
      errors: validatedField.error.flatten().fieldErrors,
      message: 'Please enter a subject',
      areasSelected: prevState.areasSelected,
    };
  }

  const searchState = new SearchStateManager({
    [SearchParams.AreasSelected]: prevState.areasSelected,
  });

  if (validatedField.success) {
    searchState.addParamValueToState(
      SearchParams.SearchedIndicator,
      validatedField.data.indicator
    );
  }

  redirect(searchState.generatePath('/results'), RedirectType.push);
}
