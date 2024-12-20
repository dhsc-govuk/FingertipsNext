'use server';

import { redirect, RedirectType } from 'next/navigation';

export type SomeState = {
  indicators?: string[];
};

export async function viewCharts(
  prevState: SomeState,
  formData: FormData
): Promise<SomeState> {
  const indicatorsSelected = formData.getAll('indicator')?.toString();

  redirect(
    `/chart?indicatorsSelected=${encodeURIComponent(indicatorsSelected)}`,
    RedirectType.push
  );
}
