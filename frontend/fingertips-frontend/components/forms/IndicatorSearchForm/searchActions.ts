import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { redirect, RedirectType } from 'next/navigation';
import { z } from 'zod';

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

  if (!validatedField.success) {
    return {
      indicator: formData.get('indicator')?.toString().trim() ?? '',
      errors: validatedField.error.flatten().fieldErrors,
      message: 'Please enter a subject',
    };
  }

  const { indicator } = validatedField.data;

  const searchState = new SearchStateManager({
    [SearchParams.SearchedIndicator]: indicator,
  });
  redirect(searchState.generatePath('results'), RedirectType.push);
}
