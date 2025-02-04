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

  console.log(validatedField);

  if (!validatedField.success && prevState.areasSelected?.length === 0) {
    console.log('oh no!');
    console.log(`validation failure: ${!validatedField.success}`);
    console.log(`0 areas selected: ${prevState.areasSelected?.length === 0}`);
    return {
      indicator: formData.get('indicator')?.toString().trim() ?? '',
      errors: validatedField.error.flatten().fieldErrors,
      message: 'Please enter a subject',
      areasSelected: prevState.areasSelected,
    };
  }

  let indicator = '';

  if (validatedField.success) {
    indicator = validatedField.data.indicator;
  }

  const searchState = new SearchStateManager({
    [SearchParams.SearchedIndicator]: indicator,
    [SearchParams.AreasSelected]: prevState.areasSelected,
  });

  redirect(searchState.generatePath('results'), RedirectType.push);
}
