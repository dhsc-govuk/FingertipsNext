'use server';

import { z } from 'zod';
import { redirect, RedirectType } from 'next/navigation';
import { SearchStateManager } from '@/lib/searchStateManager';

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

  const searchState = new SearchStateManager(indicator);
  redirect(searchState.generatePath('/search/results'), RedirectType.push);
}
