'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';

const $SearchFormSchema = z.object({
  indicator: z.string({
    invalid_type_error: 'Please enter an indicator id',
  }),
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
) {
  const validatedFields = $SearchFormSchema.safeParse({
    indicator: formData.get('indicator'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields',
    };
  }

  const { indicator } = validatedFields.data;

  redirect(`/search/results?indicator=${indicator}`);
}